/**
 * authService — Development session layer.
 *
 * Public API is intentionally shaped to mirror Firebase Authentication so
 * that swapping implementations never requires changes to pages or components.
 *
 * To replace with Firebase:
 *   - Swap `login()` body with `signInWithEmailAndPassword(auth, email, password)`
 *   - Swap `logout()` body with `signOut(auth)`
 *   - Swap `isAuthenticated()` body with `auth.currentUser !== null`
 *   - Swap `getCurrentUser()` body with `auth.currentUser`
 *   - Security events will connect to Firestore/Cloud Logging
 */

import {
  DEV_ADMIN_CREDENTIALS,
  DEV_MFA_CODES,
  DEV_RESET_OTP,
  DEV_SESSION_DURATION_MS,
} from '@/config/devAuth'
import { bootstrapSession, endSession } from '@/platform/api/auth'
import { tokenStore } from '@/platform/api/tokenStore'

// Transient credentials captured during the login→MFA flow, used only to obtain
// a real backend session token once MFA passes. Never persisted.
let _pendingEmail = ''
let _pendingPassword = ''
let _pendingMfaCode = ''

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  role: 'admin'
  loginAt: string
}

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_FAILED_MULTIPLE'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_CHANGED'
  | 'NEW_DEVICE_LOGIN'
  | 'SUSPICIOUS_LOGIN'
  | 'MFA_VERIFIED'
  | 'LOGOUT'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  description: string
  timestamp: string
  severity: 'info' | 'warning' | 'danger'
  metadata?: Record<string, string>
}

export interface LoginResult {
  success: boolean
  error?: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'UNKNOWN'
}

// ─── Storage keys ─────────────────────────────────────────────────────────────

const SESSION_KEY = 'perimo_admin_session'
const SECURITY_LOG_KEY = 'perimo_security_log'
const FAILED_ATTEMPTS_KEY = 'perimo_failed_attempts'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function now(): string {
  return new Date().toISOString()
}

function appendSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
  const log = authService.getSecurityLog()
  const newEvent: SecurityEvent = { ...event, id: generateId(), timestamp: now() }
  // Keep the most recent 50 events
  const updated = [newEvent, ...log].slice(0, 50)
  sessionStorage.setItem(SECURITY_LOG_KEY, JSON.stringify(updated))
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * Validate credentials against dev config.
   * Replace body with Firebase `signInWithEmailAndPassword` for production.
   */
  login(email: string, password: string): LoginResult {
    const failedAttempts = Number(sessionStorage.getItem(FAILED_ATTEMPTS_KEY) || '0')

    if (failedAttempts >= 5) {
      appendSecurityEvent({
        type: 'LOGIN_FAILED_MULTIPLE',
        description: `Account temporarily locked after ${failedAttempts} failed attempts.`,
        severity: 'danger',
        metadata: { email },
      })
      return { success: false, error: 'ACCOUNT_LOCKED' }
    }

    const emailMatch = email.trim().toLowerCase() === DEV_ADMIN_CREDENTIALS.email.toLowerCase()
    const passMatch = password === DEV_ADMIN_CREDENTIALS.password

    if (!emailMatch || !passMatch) {
      const attempts = failedAttempts + 1
      sessionStorage.setItem(FAILED_ATTEMPTS_KEY, String(attempts))
      appendSecurityEvent({
        type: attempts >= 3 ? 'LOGIN_FAILED_MULTIPLE' : 'LOGIN_FAILED',
        description: `Failed login attempt ${attempts} for email: ${email}`,
        severity: attempts >= 3 ? 'danger' : 'warning',
        metadata: { email, attempt: String(attempts) },
      })
      return { success: false, error: 'INVALID_CREDENTIALS' }
    }

    // Successful credential check — session created after MFA
    sessionStorage.removeItem(FAILED_ATTEMPTS_KEY)
    // Capture credentials transiently so the backend session can be bootstrapped
    // after MFA passes (no-op if the API base URL is not configured).
    _pendingEmail = email.trim()
    _pendingPassword = password
    appendSecurityEvent({
      type: 'LOGIN_SUCCESS',
      description: `Credentials verified for ${email}. Awaiting MFA.`,
      severity: 'info',
      metadata: { email },
    })
    return { success: true }
  },

  /**
   * Finalise session after MFA passes.
   * Replace body with Firebase ID token storage for production.
   */
  createSession(email: string): void {
    const user: AdminUser = {
      uid: `dev-${generateId()}`,
      email,
      displayName: 'Stadium Administrator',
      role: 'admin',
      loginAt: now(),
    }
    const session = {
      user,
      expiresAt: Date.now() + DEV_SESSION_DURATION_MS,
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))

    // Bootstrap a real backend session using the credentials captured during the
    // login→MFA flow. Fire-and-forget: registered with the token store so the
    // first authenticated API request awaits token readiness. Degrades to the
    // dev session (no throw, no UI change) if the API is unconfigured/unreachable.
    if (_pendingEmail && _pendingPassword && _pendingMfaCode) {
      const boot = bootstrapSession(_pendingEmail, _pendingPassword, _pendingMfaCode)
      tokenStore.setBootstrap(boot)
    }
    _pendingPassword = ''
    _pendingMfaCode = ''

    appendSecurityEvent({
      type: 'NEW_DEVICE_LOGIN',
      description: `Admin session created for ${email}`,
      severity: 'info',
      metadata: { email },
    })
  },

  /** Replace with Firebase `signOut(auth)` for production. */
  logout(): void {
    const user = this.getCurrentUser()
    if (user) {
      appendSecurityEvent({
        type: 'LOGOUT',
        description: `Admin ${user.email} signed out.`,
        severity: 'info',
      })
    }
    sessionStorage.removeItem(SESSION_KEY)
    // Revoke the backend refresh session and clear tokens (best-effort).
    void endSession()
  },

  /** Replace with `auth.currentUser !== null` check for production. */
  isAuthenticated(): boolean {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (!raw) return false
      const session = JSON.parse(raw) as { expiresAt: number }
      return Date.now() < session.expiresAt
    } catch {
      return false
    }
  },

  /** Replace with `auth.currentUser` for production. */
  getCurrentUser(): AdminUser | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY)
      if (!raw) return null
      const session = JSON.parse(raw) as { user: AdminUser; expiresAt: number }
      if (Date.now() >= session.expiresAt) {
        sessionStorage.removeItem(SESSION_KEY)
        return null
      }
      return session.user
    } catch {
      return null
    }
  },

  /**
   * Validate MFA code (dev simulation).
   * Replace with Firebase TOTP / SMS verification for production.
   */
  verifyMfa(code: string): boolean {
    const valid = (DEV_MFA_CODES as readonly string[]).includes(code.trim())
    if (valid) {
      // Capture the code so createSession() can complete the backend MFA step.
      _pendingMfaCode = code.trim()
    }
    appendSecurityEvent({
      type: valid ? 'MFA_VERIFIED' : 'LOGIN_FAILED',
      description: valid ? 'MFA code verified successfully.' : 'Invalid MFA code entered.',
      severity: valid ? 'info' : 'warning',
    })
    return valid
  },

  /**
   * Validate password-reset OTP (dev simulation).
   * Replace with backend OTP verification for production.
   */
  verifyResetOtp(code: string): boolean {
    return code.trim() === DEV_RESET_OTP
  },

  /**
   * Simulate password reset (dev simulation).
   * Replace with Firebase `sendPasswordResetEmail` or backend API for production.
   */
  requestPasswordReset(email: string): void {
    appendSecurityEvent({
      type: 'PASSWORD_RESET_REQUESTED',
      description: `Password reset requested for ${email}`,
      severity: 'warning',
      metadata: { email },
    })
  },

  /** Complete password change simulation. */
  confirmPasswordChange(email: string): void {
    appendSecurityEvent({
      type: 'PASSWORD_CHANGED',
      description: `Password successfully changed for ${email}`,
      severity: 'info',
      metadata: { email },
    })
  },

  /** Read the in-memory security event log. */
  getSecurityLog(): SecurityEvent[] {
    try {
      const raw = sessionStorage.getItem(SECURITY_LOG_KEY)
      return raw ? (JSON.parse(raw) as SecurityEvent[]) : []
    } catch {
      return []
    }
  },
}
