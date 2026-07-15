/**
 * apiClient — the shared data-access seam for PERIMO.
 *
 * One fetch wrapper for the whole app: base URL, bearer-token injection, a single
 * transparent refresh-and-retry on 401, and normalisation of the backend error
 * envelope into a typed `ApiError`. Every data hook and feature service goes
 * through this — nothing calls `fetch` directly.
 *
 * The base URL comes from `VITE_API_BASE_URL`. When it is unset the client is
 * considered "not configured" and callers may keep their existing behaviour;
 * this lets the backend be wired in module-by-module without a big-bang switch.
 */

import { ApiError, type ApiErrorBody, type TokenResponse } from './types'
import { tokenStore } from './tokenStore'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

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
  signal?: AbortSignal
}

async function rawRequest<T>(path: string, opts: RequestOptions, allowRetry: boolean): Promise<T> {
  if (!isApiConfigured()) {
    throw new ApiError('API base URL is not configured.', 'api_not_configured', 0)
  }

  const headers: Record<string, string> = {}
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json'
  if (!opts.anonymous) {
    // If a login bootstrap is in flight, wait for it so the first authed
    // request after sign-in doesn't race ahead of the token.
    if (!tokenStore.getAccess()) await tokenStore.awaitReady()
    const token = tokenStore.getAccess()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  })

  if (res.status === 401 && allowRetry && !opts.anonymous) {
    const refreshed = await tryRefresh()
    if (refreshed) return rawRequest<T>(path, opts, /* allowRetry */ false)
  }

  if (!res.ok) throw await parseError(res)
  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export const apiClient = {
  get: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'GET' }, true),

  post: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'POST', body }, true),

  patch: <T>(path: string, body?: unknown, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'PATCH', body }, true),

  delete: <T>(path: string, opts: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    rawRequest<T>(path, { ...opts, method: 'DELETE' }, true),
}
