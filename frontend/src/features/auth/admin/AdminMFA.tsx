import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '@/features/auth/shared/BaseAuthPage'
import { OtpInput } from '@/components/ui/OtpInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'

const MFA_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10.5V8a4 4 0 118 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="15" r="1.3" fill="currentColor"/>
  </svg>
)

export const AdminMFA: React.FC = () => {
  const navigate = useNavigate()
  const email = sessionStorage.getItem('perimo_pending_email') || ''
  const [code, setCode] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (code.length < 6) {
      setErrorMsg('Please enter the complete 6-digit authentication code.')
      return
    }

    setLoading(true)
    setErrorMsg(undefined)

    setTimeout(() => {
      const valid = authService.verifyMfa(code)
      setLoading(false)

      if (!valid) {
        setErrorMsg('Invalid authentication code. Please check your authenticator app and try again.')
        return
      }

      // Create the full session now that MFA has passed
      authService.createSession(email)
      sessionStorage.removeItem('perimo_pending_email')
      navigate('/admin', { replace: true })
    }, 600)
  }

  return (
    <BaseAuthPage
      icon={MFA_ICON}
      iconWrapperClass="bg-brand-dark text-white"
      badgeText="MULTI-FACTOR VERIFICATION"
      title="Verify your identity"
      subtitle="Enter the 6-digit code from your authenticator app to access the Command Center."
      footerText="Multi-factor authentication is required for all administrator accounts."
      errorMsg={errorMsg}
      backLink="/get-started#command-center"
    >
      {/* Dev hint */}
      <div className="bg-[#F5F7FF] border border-brand/15 rounded-xl p-3.5 mb-5">
        <div className="flex items-start gap-2.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="9" stroke="#1652F0" strokeWidth="1.5"/>
            <path d="M12 8v4" stroke="#1652F0" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1" fill="#1652F0"/>
          </svg>
          <p className="text-[12px] text-text-muted leading-relaxed">
            <span className="font-semibold text-brand">Dev mode:</span>{' '}
            Use code <span className="font-mono font-semibold text-text">000000</span> or{' '}
            <span className="font-mono font-semibold text-text">123456</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label className="block text-[13px] font-semibold text-[#344055] mb-2.5">
          6-digit authentication code
        </label>
        <div className="mb-5">
          <OtpInput length={6} onChange={setCode} />
        </div>

        <p className="text-[13px] text-text-muted mb-6">
          Code not arriving?{' '}
          <button
            type="button"
            onClick={() => setCode('')}
            className="text-brand font-medium cursor-pointer bg-transparent border-none p-0 hover:text-brand-hover"
          >
            Resend code
          </button>
        </p>

        <Button
          type="submit"
          variant="dark"
          fullWidth
          disabled={loading || code.length < 6}
          className="mb-4"
        >
          {loading ? 'Verifying…' : 'Verify & Access Dashboard'}
        </Button>

        <button
          type="button"
          onClick={() => navigate('/auth/admin/login')}
          className="w-full text-[13px] text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Back to login
        </button>
      </form>
    </BaseAuthPage>
  )
}
