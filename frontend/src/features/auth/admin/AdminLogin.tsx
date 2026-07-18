import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '@/features/auth/shared/BaseAuthPage'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { DemoCredentialsCard } from '@/features/auth/shared/DemoCredentialsCard'

const LOCK_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10.5V8a4 4 0 118 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15" r="1.3" fill="currentColor"/>
  </svg>
)

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string).trim()
    const password = (fd.get('password') as string)

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields to continue.')
      return
    }

    setLoading(true)
    setErrorMsg(undefined)

    // Simulate async auth (swap body with Firebase signInWithEmailAndPassword)
    setTimeout(() => {
      const result = authService.login(email, password)
      setLoading(false)

      if (!result.success) {
        if (result.error === 'ACCOUNT_LOCKED') {
          setErrorMsg(
            'Account temporarily locked after multiple failed attempts. Please try again in 15 minutes or reset your password.'
          )
        } else {
          setErrorMsg('Incorrect email or password. Please try again.')
        }
        return
      }

      // Store email in sessionStorage so MFA page can create the session
      sessionStorage.setItem('perimo_pending_email', email)
      navigate('/auth/admin/mfa')
    }, 600)
  }

  return (
    <BaseAuthPage
      icon={LOCK_ICON}
      iconWrapperClass="bg-brand-dark text-white"
      badgeText="ENTERPRISE · RESTRICTED"
      title="Administrator sign in"
      subtitle="Secure access to the Command Center for stadium administrators."
      footerText="Access is limited to pre-approved administrator accounts."
      errorMsg={errorMsg}
      demoCard={<DemoCredentialsCard role="Administrator" email="admin@perimo.io" password="Admin@123" />}
      backLink="/get-started#command-center"
    >
      <form onSubmit={handleSubmit} noValidate>
        <Input
          name="email"
          type="email"
          label="Work email"
          placeholder="admin@perimo.io"
          autoComplete="username"
          required
        />
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-sm text-[#344055] cursor-pointer select-none">
            <input name="remember" type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => navigate('/auth/admin/forgot-password')}
            className="text-sm text-brand font-medium cursor-pointer bg-transparent border-none p-0 hover:text-brand-hover transition-colors"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="dark" fullWidth disabled={loading}>
          {loading ? 'Signing in…' : 'Admin Login'}
        </Button>

        <div className="flex items-center gap-2 mt-5 pt-5 border-t border-surface-border text-text-muted text-xs leading-[1.5]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="#5B6472" strokeWidth="1.5"/>
            <path d="M8 10.5V8a4 4 0 118 0v2.5" stroke="#5B6472" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Protected by enterprise-grade security. Multi-factor authentication required.
        </div>
      </form>
    </BaseAuthPage>
  )
}
