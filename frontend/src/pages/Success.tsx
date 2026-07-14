import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const SUCCESS_META: Record<string, { title: string; body: string; cta: string; action: string }> = {
  'fan-login': { title: 'Welcome back', body: 'You are signed in as a Fan. Enjoy the tournament.', cta: 'Enter Perimo', action: 'enter' },
  'fan-register': { title: 'Account created', body: 'Your Fan account is ready. Welcome to Perimo.', cta: 'Enter Perimo', action: 'enter' },
  'volunteer-login': { title: 'Welcome back', body: 'You are signed in to the Volunteer workspace.', cta: 'Enter Perimo', action: 'enter' },
  'volunteer-firstTime': { title: 'Account activated', body: 'Your password has been set. You can now sign in any time.', cta: 'Continue to Sign In', action: 'toLogin' },
  'staff-login': { title: 'Welcome back', body: 'You are signed in to Staff Operations.', cta: 'Enter Perimo', action: 'enter' },
  'admin-mfa': { title: 'Identity verified', body: 'You are signed in to the Command Center.', cta: 'Enter Perimo', action: 'enter' },
  'forgot': { title: 'Check your email', body: "If an account exists for that address, we've sent password reset instructions.", cta: 'Back to Sign In', action: 'toLogin' },
}

export const Success: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const kind = location.state?.kind || 'fan-login'
  const meta = SUCCESS_META[kind] || SUCCESS_META['fan-login']

  const handleCta = () => {
    if (meta.action === 'toLogin') {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-surface-subtle p-[clamp(24px,5vw,48px)_clamp(20px,5vw,24px)] font-sans">
      <div className="w-full max-w-[420px] text-center animate-perimo-fade">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="mx-auto block mb-5">
          <circle cx="12" cy="12" r="10" fill="rgba(21,122,69,0.1)"/>
          <path d="M7.5 12.5l3 3 6-6.5" stroke="#157A45" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
        <h1 className="font-display font-semibold text-[26px] text-text mb-2.5">
          {meta.title}
        </h1>
        <p className="text-[15px] leading-[1.55] text-text-muted mb-8">
          {meta.body}
        </p>
        <Button onClick={handleCta} className="px-8">
          {meta.cta}
        </Button>
      </div>
    </div>
  )
}
