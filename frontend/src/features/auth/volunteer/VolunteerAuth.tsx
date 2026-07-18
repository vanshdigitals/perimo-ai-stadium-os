import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '../shared/BaseAuthPage'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { DemoCredentialsCard } from '@/features/auth/shared/DemoCredentialsCard'

export const VolunteerAuth: React.FC = () => {
  const navigate = useNavigate()
  
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [view, setView] = useState<'login' | 'first-time' | 'empty'>('login')

  const handleSubmitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const required = Array.from(form.querySelectorAll('[required]')) as HTMLInputElement[]
    const missing = required.some((el) => !el.value || !el.value.trim())
    
    if (missing) {
      setErrorMsg('Please fill in all required fields to continue.')
      return
    }
    
    setErrorMsg(undefined)
    
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || 'volunteer@perimo.io'
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || 'dummy'
    
    const result = authService.loginDemo(email, password)
    if (!result.success) {
      setErrorMsg('Invalid credentials.')
      return
    }
    
    authService.createSession(email, 'volunteer')
    
    navigate('/auth/success', { state: { kind: 'volunteer-login' } })
  }

  const handleSubmitFirstTime = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const required = Array.from(form.querySelectorAll('[required]')) as HTMLInputElement[]
    const missing = required.some((el) => !el.value || !el.value.trim())
    
    if (missing) {
      setErrorMsg('Please fill in all required fields to continue.')
      return
    }
    
    setErrorMsg(undefined)
    
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || 'volunteer@perimo.io'
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || 'dummy'
    
    const result = authService.loginDemo(email, password)
    if (!result.success) {
      setErrorMsg('Invalid credentials.')
      return
    }
    
    authService.createSession(email, 'volunteer')
    
    navigate('/auth/success', { state: { kind: 'volunteer-firstTime' } })
  }

  const icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8.5 15.5h7M9.5 18h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  return (
    <BaseAuthPage
      icon={icon}
      iconWrapperClass="bg-[#F0F1F3] text-[#344055]"
      badgeText="INVITE ONLY"
      title="Volunteer sign in"
      subtitle={view === 'first-time' ? "Set up your password to activate your account." : "Sign in to view assigned tasks, shift schedules and AI recommendations."}
      footerText="Volunteer accounts are created by your program coordinator."
      errorMsg={errorMsg}
      demoCard={<DemoCredentialsCard role="Volunteer" email="volunteer@perimo.io" password="Volunteer@123" />}
      backLink="/get-started#volunteer"
    >
      {view === 'login' && (
        <form onSubmit={handleSubmitLogin} noValidate>
          <Input name="email" type="email" label="Email" placeholder="you@perimo.io" required />
          <PasswordInput name="password" label="Password" placeholder="Enter your password" required />
          
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-[#344055] cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" />
              Remember me
            </label>
            <span onClick={() => {}} className="text-sm text-brand font-medium cursor-pointer">
              Forgot password?
            </span>
          </div>

          <Button type="submit" fullWidth className="mb-5">
            Volunteer Login
          </Button>

          <div className="flex flex-col gap-2.5 items-center">
            <span onClick={() => setView('first-time')} className="text-[13px] text-brand font-medium cursor-pointer">
              First-time volunteer? Set up your password
            </span>
            <span onClick={() => setView('empty')} className="text-[13px] text-text-muted cursor-pointer">
              Don't have login details?
            </span>
          </div>
        </form>
      )}

      {view === 'first-time' && (
        <form onSubmit={handleSubmitFirstTime} noValidate>
          <Input name="email" type="text" label="Email or access code" placeholder="Enter the email or code from your invite" required />
          <PasswordInput name="password" label="New password" placeholder="Create a password" required />
          <PasswordInput name="confirmpassword" label="Confirm password" placeholder="Re-enter your password" required />
          
          <Button type="submit" fullWidth className="mb-4">
            Activate Account
          </Button>
          
          <div className="text-center">
            <span onClick={() => setView('login')} className="text-[13px] text-text-muted cursor-pointer">
              ← Back to login
            </span>
          </div>
        </form>
      )}

      {view === 'empty' && (
        <div className="text-center pt-3 pb-1">
          <svg width="56" height="56" viewBox="0 0 64 64" fill="none" className="mx-auto block mb-5">
            <rect x="8" y="14" width="48" height="36" rx="8" stroke="#8A93A6" strokeWidth="1.5" strokeDasharray="4 4"/>
            <text x="32" y="38" fontFamily="IBM Plex Sans" fontSize="20" fill="#5B6472" textAnchor="middle">?</text>
          </svg>
          <h3 className="font-display font-semibold text-lg text-text mb-2">No account found</h3>
          <p className="text-sm leading-[1.55] text-text-muted mb-6">
            Volunteer accounts are created by your program coordinator. Contact your team lead to get access.
          </p>
          <Button variant="outline" fullWidth onClick={() => setView('login')}>
            ← Back to login
          </Button>
        </div>
      )}
    </BaseAuthPage>
  )
}
