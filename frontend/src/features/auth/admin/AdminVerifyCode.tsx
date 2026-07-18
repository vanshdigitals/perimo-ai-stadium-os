import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '@/features/auth/shared/BaseAuthPage'
import { OtpInput } from '@/components/ui/OtpInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'

const SHIELD_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const AdminVerifyCode: React.FC = () => {
  const navigate = useNavigate()
  const email = sessionStorage.getItem('perimo_reset_email') || ''
  const [code, setCode] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (code.length < 6) {
      setErrorMsg('Please enter the complete 6-digit code.')
      return
    }

    setLoading(true)
    setErrorMsg(undefined)

    setTimeout(() => {
      const valid = authService.verifyResetOtp(code)
      setLoading(false)
      if (!valid) {
        setErrorMsg('Invalid verification code. Please check and try again.')
        return
      }
      navigate('/auth/admin/reset-password')
    }, 500)
  }

  return (
    <BaseAuthPage
      icon={SHIELD_ICON}
      iconWrapperClass="bg-brand-dark text-white"
      badgeText="ENTERPRISE · RESTRICTED"
      title="Enter verification code"
      subtitle={`We sent a 6-digit code to ${email || 'your email'}. Enter it below to continue.`}
      footerText="The code expires in 10 minutes."
      errorMsg={errorMsg}
      backLink="/get-started#command-center"
    >
      <form onSubmit={handleSubmit} noValidate>
        <label className="block text-[13px] font-semibold text-[#344055] mb-2.5">
          6-digit verification code
        </label>
        <div className="mb-5">
          <OtpInput length={6} onChange={setCode} />
        </div>

        <p className="text-[13px] text-text-muted mb-6">
          Didn't receive it?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/admin/email-sent')}
            className="text-brand font-medium cursor-pointer bg-transparent border-none p-0 hover:text-brand-hover"
          >
            Resend code
          </button>
        </p>

        <Button type="submit" variant="dark" fullWidth disabled={loading || code.length < 6}>
          {loading ? 'Verifying…' : 'Verify Code'}
        </Button>
      </form>
    </BaseAuthPage>
  )
}
