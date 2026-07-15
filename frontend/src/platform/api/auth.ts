/**
 * apiAuth — backend token lifecycle for the data seam.
 *
 * These functions talk to `/v1/auth/*` and write tokens into `tokenStore`. They
 * are used by the legacy `authService` to obtain a real backend session during
 * the existing admin login → MFA flow, without changing any UI component.
 *
 * Everything degrades gracefully: if the API is not configured or unreachable,
 * `bootstrapSession` resolves to `false` and the caller keeps working against its
 * existing (dev) session — no throw, no UI disruption.
 */

import { apiClient, isApiConfigured } from './client'
import { tokenStore } from './tokenStore'
import type { MfaChallengeResponse, TokenResponse } from './types'

type LoginResult = TokenResponse | MfaChallengeResponse

function isChallenge(r: LoginResult): r is MfaChallengeResponse {
  return (r as MfaChallengeResponse).mfa_required === true
}

/**
 * Perform the full backend login (login → MFA verify) and store tokens.
 * Returns true on success. Never throws — returns false on any failure so the
 * legacy dev session flow continues unaffected.
 */
export async function bootstrapSession(
  email: string,
  password: string,
  mfaCode: string,
): Promise<boolean> {
  if (!isApiConfigured()) return false
  try {
    const result = await apiClient.post<LoginResult>('/v1/auth/login', { email, password }, { anonymous: true })
    let tokens: TokenResponse
    if (isChallenge(result)) {
      tokens = await apiClient.post<TokenResponse>(
        '/v1/auth/mfa/verify',
        { challenge_token: result.challenge_token, code: mfaCode },
        { anonymous: true },
      )
    } else {
      tokens = result
    }
    tokenStore.set(tokens.access_token, tokens.refresh_token)
    return true
  } catch {
    return false
  }
}

/** Revoke the backend session (best-effort) and clear local tokens. */
export async function endSession(): Promise<void> {
  const refresh = tokenStore.getRefresh()
  if (isApiConfigured() && refresh) {
    try {
      await apiClient.post('/v1/auth/logout', { refresh_token: refresh }, { anonymous: true })
    } catch {
      /* best-effort */
    }
  }
  tokenStore.clear()
}
