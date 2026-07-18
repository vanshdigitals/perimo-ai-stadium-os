/**
 * apiClient — the shared data-access seam for PERIMO.
 *
 * One fetch wrapper for the whole app:
 *   • base URL from `VITE_API_BASE_URL` (unset → "not configured")
 *   • bearer-token injection + a single transparent refresh-and-retry on 401
 *   • per-request timeout via an internal AbortController (combined with any
 *     caller-supplied signal)
 *   • transient-failure retry with exponential backoff + jitter — automatic for
 *     safe/idempotent methods (GET) only, so writes are never double-submitted
 *   • centralized normalisation of every failure (HTTP error envelope, network
 *     error, timeout) into a typed `ApiError`
 *
 * Every data hook and feature service goes through this — nothing calls `fetch`
 * directly.
 */

import { ApiError, type ApiErrorBody, type TokenResponse } from './types'
import { tokenStore } from './tokenStore'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

const DEFAULT_TIMEOUT_MS = 15_000
const DEFAULT_RETRIES = 2 // for transient failures on safe methods
const RETRY_BASE_MS = 400 // exponential base: 400ms, 800ms, ...

export function isApiConfigured(): boolean {
  return BASE_URL.length > 0
}

async function parseError(res: Response): Promise<ApiError> {
  let code = 'http_error'
  let message = `Request failed (${res.status}).`
  try {
    const body = (await res.json()) as Partial<ApiErrorBody>
    if (body?.error) {
      code = body.error.code ?? code
      message = body.error.message ?? message
    }
  } catch {
    /* non-JSON error body — keep defaults */
  }
  return new ApiError(message, code, res.status)
}

async function tryRefresh(): Promise<boolean> {
  const refresh = tokenStore.getRefresh()
  if (!refresh) return false
  try {
    const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    })
    if (!res.ok) {
      tokenStore.clear()
      return false
    }
    const data = (await res.json()) as TokenResponse
    tokenStore.setAccess(data.access_token)
    return true
  } catch {
    return false
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /** When true, do not attach the bearer token (used for login/refresh). */
  anonymous?: boolean
  /** Caller cancellation (e.g. React unmount). Combined with the timeout signal. */
  signal?: AbortSignal
  /** Per-request timeout in ms (default 15s). */
  timeoutMs?: number
  /** Override the automatic transient-retry count (default: 2 for GET, 0 for writes). */
  retry?: number
}

const SAFE_METHODS = new Set(['GET'])

function isRetryableStatus(status: number): boolean {
  return status >= 500 && status < 600
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** One network attempt: timeout + auth-refresh handling + typed error normalisation. */
async function attempt<T>(path: string, opts: RequestOptions, allowAuthRetry: boolean): Promise<T> {
  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (!opts.anonymous) {
    // If a login bootstrap is in flight, wait for it so the first authed
    // request after sign-in doesn't race ahead of the token.
    if (!tokenStore.getAccess()) await tokenStore.awaitReady()
    const token = tokenStore.getAccess()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  // Internal controller drives the timeout; the caller's signal (if any) also
  // aborts it, so unmount-cancellation still works.
  const controller = new AbortController()
  let timedOut = false
  const timeout = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, opts.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  const onCallerAbort = () => controller.abort()
  if (opts.signal) {
    if (opts.signal.aborted) controller.abort()
    else opts.signal.addEventListener('abort', onCallerAbort, { once: true })
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    })

    if (res.status === 401 && allowAuthRetry && !opts.anonymous) {
      const refreshed = await tryRefresh()
      if (refreshed) return attempt<T>(path, opts, /* allowAuthRetry */ false)
    }

    if (!res.ok) throw await parseError(res)
    if (res.status === 204) return undefined as T
    return (await res.json()) as T
  } catch (err) {
    // Timeout → typed error; caller cancellation → rethrow so hooks can ignore it.
    if (err instanceof DOMException && err.name === 'AbortError') {
      if (opts.signal?.aborted && !timedOut) throw err // genuine caller cancellation
      throw new ApiError('The request timed out. Please try again.', 'timeout', 0)
    }
    if (err instanceof ApiError) throw err
    // fetch() rejects with TypeError on network failure (DNS, offline, CORS, …).
    throw new ApiError('Network error — please check your connection.', 'network', 0)
  } finally {
    clearTimeout(timeout)
    if (opts.signal) opts.signal.removeEventListener('abort', onCallerAbort)
  }
}

/** Attempt + transient-retry (backoff + jitter) for safe methods. */
async function rawRequest<T>(path: string, opts: RequestOptions): Promise<T> {
  const method = opts.method ?? 'GET'
  const maxRetries = opts.retry ?? (SAFE_METHODS.has(method) ? DEFAULT_RETRIES : 0)

  let lastError: unknown
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await attempt<T>(path, opts, /* allowAuthRetry */ true)
    } catch (err) {
      lastError = err
      // Never retry a caller-cancelled request.
      if (opts.signal?.aborted) throw err
      const retryable =
        err instanceof ApiError &&
        (err.code === 'network' || err.code === 'timeout' || isRetryableStatus(err.status))
      if (!retryable || i === maxRetries) throw err
      await sleep(RETRY_BASE_MS * 2 ** i + Math.random() * 150)
    }
  }
  throw lastError
}

export const apiClient = {
  get: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'GET' }),

  post: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'POST', body }),

  patch: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'PATCH', body }),

  delete: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'DELETE' }),
}
