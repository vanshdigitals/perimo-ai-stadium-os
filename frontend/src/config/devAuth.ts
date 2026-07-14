/**
 * Development-only authentication credentials.
 *
 * IMPORTANT: This file is ONLY for development simulation.
 * Replace this entire module with a Firebase/backend auth call
 * in production — the consuming services (authService.ts) are
 * already structured to make that swap transparent to the UI.
 *
 * Never commit real production credentials here.
 */

export const DEV_ADMIN_CREDENTIALS = {
  email: 'admin@perimo.io',
  password: 'Admin@123',
} as const

/** Dev MFA code — accepts any of these during development simulation */
export const DEV_MFA_CODES = ['000000', '123456'] as const

/** Dev OTP for password-reset verification */
export const DEV_RESET_OTP = '654321' as const

export const DEV_SESSION_DURATION_MS = 8 * 60 * 60 * 1000 // 8 hours
