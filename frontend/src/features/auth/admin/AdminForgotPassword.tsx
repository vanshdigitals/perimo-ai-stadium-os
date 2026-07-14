import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '@/features/auth/shared/BaseAuthPage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'

const EMAIL_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M3 9l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const AdminForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string).trim()

    if (!email) {
      setErrorMsg('Please enter your email address to continue.')
      return
    }

    setLoading(true)
    setErrorMsg(undefined)

    setTimeout(() => {
      authService.requestPasswordReset(email)
      // Store email for the verify-code step
      sessionStorage.setItem('perimo_reset_email', email)
      setLoading(false)
      navigate('/auth/admin/email-sent')
    }, 600)
  }

  return (
    <BaseAuthPage
      icon={EMAIL_ICON}
      iconWrapperClass="bg-brand-dark text-white"
      badgeText="ENTERPRISE · RESTRICTED"
      title="Reset your password"
      subtitle="Enter the email address linked to your administrator account. We'll send a secure verification code."
      footerText="Only pre-approved administrator accounts can reset their password."
      errorMsg={errorMsg}
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

        <Button type="submit" variant="dark" fullWidth disabled={loading}>
          {loading ? 'Sending…' : 'Send Verification Code'}
        </Button>
      </form>
    </BaseAuthPage>
  )
}
