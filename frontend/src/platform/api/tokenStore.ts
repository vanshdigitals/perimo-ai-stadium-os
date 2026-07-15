/**
 * tokenStore — the single owner of backend access/refresh tokens.
 *
 * Tokens are held in memory and mirrored to sessionStorage so a page refresh
 * within the same tab keeps the session. This is deliberately separate from the
 * legacy `authService` (which owns the admin login *UX*): the API client reads
 * tokens from here, and the auth bootstrap writes them here.
 */

const ACCESS_KEY = 'perimo_access_token'
const REFRESH_KEY = 'perimo_refresh_token'

let accessToken: string | null = null
let refreshToken: string | null = null
/** In-flight backend session bootstrap, so requests can await it (no import cycle). */
let pendingBootstrap: Promise<unknown> | null = null

function loadFromStorage(): void {
  try {
    accessToken = sessionStorage.getItem(ACCESS_KEY)
    refreshToken = sessionStorage.getItem(REFRESH_KEY)
  } catch {
    // sessionStorage unavailable (SSR / privacy mode) — stay in-memory only.
  }
}

loadFromStorage()

export const tokenStore = {
  getAccess(): string | null {
    return accessToken
  },

  getRefresh(): string | null {
    return refreshToken
  },

  set(access: string, refresh: string): void {
    accessToken = access
    refreshToken = refresh
    try {
      sessionStorage.setItem(ACCESS_KEY, access)
      sessionStorage.setItem(REFRESH_KEY, refresh)
    } catch {
      /* in-memory only */
    }
  },

  setAccess(access: string): void {
    accessToken = access
    try {
      sessionStorage.setItem(ACCESS_KEY, access)
    } catch {
      /* in-memory only */
    }
  },

  clear(): void {
    accessToken = null
    refreshToken = null
    try {
      sessionStorage.removeItem(ACCESS_KEY)
      sessionStorage.removeItem(REFRESH_KEY)
    } catch {
      /* no-op */
    }
  },

  hasSession(): boolean {
    return Boolean(accessToken)
  },

  /** Register an in-flight session bootstrap so callers can await token readiness. */
  setBootstrap(promise: Promise<unknown>): void {
    pendingBootstrap = promise
    void promise.finally(() => {
      if (pendingBootstrap === promise) pendingBootstrap = null
    })
  },

  /** Resolve once any in-flight bootstrap has settled (immediately if none). */
  async awaitReady(): Promise<void> {
    if (pendingBootstrap) {
      try {
        await pendingBootstrap
      } catch {
        /* bootstrap failures are handled by the caller */
      }
    }
  },
}
