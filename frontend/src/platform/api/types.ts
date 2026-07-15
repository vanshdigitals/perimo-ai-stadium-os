/**
 * Shared API types for the PERIMO data seam.
 *
 * This is the single place the frontend expresses the backend's error envelope
 * and token contracts, so every hook and service shares one shape.
 */

/** Backend error envelope: `{ error: { code, message } }`. */
export interface ApiErrorBody {
  error: { code: string; message: string }
}

/** Normalised error thrown by the API client. `code` is stable and switchable. */
export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(message: string, code: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

/** Public user projection returned by the auth endpoints. */
export interface ApiUser {
  id: string
  email: string
  display_name: string
  role: 'admin' | 'staff' | 'volunteer' | 'fan'
  status: 'active' | 'suspended'
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: ApiUser
}

export interface MfaChallengeResponse {
  mfa_required: true
  challenge_token: string
}
