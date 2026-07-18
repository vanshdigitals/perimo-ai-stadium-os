import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '@/features/auth/shared/BaseAuthPage'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'

const KEY_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11.5 10.5L20 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 5l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M16 7l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const passwordRules = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /\d/.test(p) },
  { label: 'One special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export const AdminResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const email = sessionStorage.getItem('perimo_reset_email') || ''
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const allRulesPassed = passwordRules.every((r) => r.test(password))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const confirm = fd.get('confirm') as string

    if (!allRulesPassed) {
      setErrorMsg('Password does not meet all requirements.')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    setErrorMsg(undefined)

    setTimeout(() => {
      authService.confirmPasswordChange(email)
      sessionStorage.removeItem('perimo_reset_email')
      setLoading(false)
      navigate('/auth/admin/reset-success')
    }, 600)
  }

  return (
    <BaseAuthPage
      icon={KEY_ICON}
      iconWrapperClass="bg-brand-dark text-white"
      badgeText="ENTERPRISE · RESTRICTED"
      title="Create new password"
      subtitle="Your new password must be different from previously used passwords."
      footerText="Only pre-approved administrator accounts can reset their password."
      errorMsg={errorMsg}
      backLink="/get-started#command-center"
    >
      <form onSubmit={handleSubmit} noValidate>
        <PasswordInput
          name="password"
          label="New password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Strength rules */}
        {password.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mb-4 -mt-1">
            {passwordRules.map((rule) => {
              const ok = rule.test(password)
              return (
                <div key={rule.label} className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
                    <circle cx="6.5" cy="6.5" r="6.5" fill={ok ? '#157A45' : '#E2E4E9'}/>
                    {ok && <path d="M3.5 6.5l2 2 4-4" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>}
                  </svg>
                  <span className={`text-[11px] leading-tight ${ok ? 'text-[#157A45]' : 'text-text-muted'}`}>
                    {rule.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <PasswordInput
          name="confirm"
          label="Confirm new password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />

        <Button
          type="submit"
          variant="dark"
          fullWidth
          disabled={loading || !allRulesPassed}
        >
          {loading ? 'Updating…' : 'Update Password'}
        </Button>
      </form>
    </BaseAuthPage>
  )
}
