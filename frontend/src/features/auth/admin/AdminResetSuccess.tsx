import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/features/auth/shared/AuthLayout'
import { Button } from '@/components/ui/Button'

export const AdminResetSuccess: React.FC = () => {
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <div className="bg-white border border-surface-border rounded-2xl p-[clamp(28px,5vw,40px)_clamp(24px,5vw,36px)] shadow-[0_1px_2px_rgba(10,14,20,0.06)] text-center animate-perimo-fade">
        {/* Success icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#157A45]/10 flex items-center justify-center mx-auto mb-6">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M6 15l6.5 6.5L24 9" stroke="#157A45" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <span className="text-xs font-semibold tracking-[0.03em] text-text-muted bg-surface-subtle px-3 py-1.5 rounded-full inline-block mb-5">
          ENTERPRISE · RESTRICTED
        </span>

        <h1 className="font-display font-semibold text-2xl text-text mb-3">
          Password updated
        </h1>
        <p className="text-sm leading-relaxed text-text-muted mb-8">
          Your administrator password has been successfully changed. All active sessions have been invalidated for security.
        </p>

        {/* Security summary */}
        <div className="bg-surface-subtle rounded-xl p-4 text-left mb-8 space-y-2.5">
          {[
            { label: 'Password changed', value: new Date().toLocaleString() },
            { label: 'Sessions invalidated', value: 'All devices' },
            { label: 'Next step', value: 'Sign in with new password' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between text-[13px]">
              <span className="text-text-muted">{label}</span>
              <span className="font-medium text-text">{value}</span>
            </div>
          ))}
        </div>

        <Button variant="dark" fullWidth onClick={() => navigate('/auth/admin/login')}>
          Return to Login
        </Button>
      </div>

      <p className="text-center text-[13px] text-text-muted mt-5 leading-[1.5]">
        Only pre-approved administrator accounts can access the Command Center.
      </p>
    </AuthLayout>
  )
}
