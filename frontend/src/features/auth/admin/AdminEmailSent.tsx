import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/shared/AuthLayout'
import { Button } from '@/components/ui/Button'

export const AdminEmailSent: React.FC = () => {
  const navigate = useNavigate()
  const email = sessionStorage.getItem('perimo_reset_email') || 'your email'

  return (
    <AuthLayout>
      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate('/auth/admin/forgot-password')}
        className="flex items-center gap-1.5 text-text-muted text-sm cursor-pointer mb-5 w-fit hover:text-text transition-colors bg-transparent border-none p-0"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <div className="bg-white border border-surface-border rounded-2xl p-[clamp(28px,5vw,40px)_clamp(24px,5vw,36px)] shadow-[0_1px_2px_rgba(10,14,20,0.06)] text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center mx-auto mb-6">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="white" strokeWidth="1.5"/>
            <path d="M3 9l9 6 9-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className="text-xs font-semibold tracking-[0.03em] text-text-muted bg-surface-subtle px-3 py-1.5 rounded-full inline-block mb-5">
          ENTERPRISE · RESTRICTED
        </span>

        <h1 className="font-display font-semibold text-2xl text-text mb-3">
          Check your inbox
        </h1>
        <p className="text-sm leading-relaxed text-text-muted mb-1">
          We've sent a 6-digit verification code to:
        </p>
        <p className="text-sm font-semibold text-text mb-6 break-all">{email}</p>

        <div className="bg-[#F5F7FF] border border-brand/15 rounded-xl p-4 text-left mb-6">
          <div className="flex items-start gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="9" stroke="#1652F0" strokeWidth="1.5"/>
              <path d="M12 8v4" stroke="#1652F0" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#1652F0"/>
            </svg>
            <div>
              <p className="text-[13px] font-semibold text-brand mb-0.5">Development mode</p>
              <p className="text-[12px] text-text-muted leading-relaxed">
                Use code <span className="font-mono font-semibold text-text">654321</span> to continue.
                In production this will be a real email.
              </p>
            </div>
          </div>
        </div>

        <Button variant="dark" fullWidth onClick={() => navigate('/auth/admin/verify-code')}>
          Enter Verification Code
        </Button>

        <button
          type="button"
          onClick={() => navigate('/auth/admin/forgot-password')}
          className="mt-4 text-[13px] text-text-muted hover:text-text transition-colors bg-transparent border-none cursor-pointer w-full"
        >
          Didn't receive it? Resend code
        </button>
      </div>

      <p className="text-center text-[13px] text-text-muted mt-5 leading-[1.5]">
        Only pre-approved administrator accounts can reset their password.
      </p>
    </AuthLayout>
  )
}
