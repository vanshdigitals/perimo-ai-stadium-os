import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../shared/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const required = Array.from(form.querySelectorAll('[required]')) as HTMLInputElement[]
    const missing = required.some((el) => !el.value || !el.value.trim())
    
    if (missing) {
      setErrorMsg('Please fill in all required fields to continue.')
      return
    }
    
    setErrorMsg(undefined)
    navigate('/auth/success', { state: { kind: 'forgot' } })
  }

  return (
    <AuthLayout>
      <div 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-1.5 text-text-muted text-sm cursor-pointer mb-5 w-fit hover:text-text transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to login
      </div>

      <div className="bg-white border border-surface-border rounded-2xl p-[clamp(28px,5vw,40px)_clamp(24px,5vw,36px)] shadow-[0_1px_2px_rgba(10,14,20,0.06)]">
        <h1 className="font-display font-semibold text-2xl text-text mb-2">
          Reset your password
        </h1>
        <p className="text-sm leading-[1.5] text-text-muted mb-6">
          Enter the email associated with your account and we'll send you a reset link.
        </p>

        {errorMsg && (
          <div className="flex gap-2.5 items-start bg-[#C4291C]/10 border-l-[3px] border-[#C4291C] rounded-lg py-3 px-3.5 mb-5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-px">
              <circle cx="12" cy="12" r="9" stroke="#C4291C" strokeWidth="1.5"/>
              <path d="M12 7.5v5.5" stroke="#C4291C" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16.2" r="1" fill="#C4291C"/>
            </svg>
            <span className="text-[13px] leading-[1.5] text-[#8f2015]">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Button type="submit" fullWidth className="mt-2">
            Send Reset Link
          </Button>
        </form>
      </div>
    </AuthLayout>
  )
}
