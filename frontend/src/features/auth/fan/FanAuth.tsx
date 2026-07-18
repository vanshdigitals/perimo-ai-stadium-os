import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BaseAuthPage } from '../shared/BaseAuthPage'
import { SocialLogin } from '@/components/ui/SocialLogin'
import { Divider } from '@/components/ui/Divider'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

import { authService } from '@/features/auth/services/authService'
import { DemoCredentialsCard } from '@/features/auth/shared/DemoCredentialsCard'

export const FanAuth: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isRegister = location.pathname.includes('register')
  
  const [errorMsg, setErrorMsg] = useState<string | undefined>()
  const [method, setMethod] = useState<'email' | 'phone'>('email')

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
    
    // Use demo login for fan (accepts any non-empty input)
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || 'fan@perimo.io'
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || 'dummy'
    
    const result = authService.loginDemo(email, password)
    if (!result.success) {
      setErrorMsg('Invalid credentials.')
      return
    }
    
    authService.createSession(email, 'fan')
    
    navigate('/auth/fan/welcome')
  }

  const icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4.5 20c0-4.14 3.36-7 7.5-7s7.5 2.86 7.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )

  return (
    <BaseAuthPage
      icon={icon}
      iconWrapperClass="bg-brand/10 text-brand"
      badgeText="PUBLIC REGISTRATION"
      title={isRegister ? "Create your Fan account" : "Log in to Perimo"}
      subtitle={isRegister ? "Join Perimo to unlock AI-powered stadium experiences." : "Access AI stadium navigation, live updates and personalized recommendations."}
      footerText="Fan accounts are self-service and free for all ticket holders."
      errorMsg={errorMsg}
      demoCard={<DemoCredentialsCard role="Fan" email="fan@perimo.io" password="Fan@123" />}
      backLink="/get-started#fan"
    >
      <div className="flex bg-surface-subtle rounded-full p-1 mb-6">
        <button
          type="button"
          onClick={() => navigate('/auth/fan/login')}
          className={cn(
            "flex-1 h-[38px] border-none rounded-full font-sans text-sm font-semibold cursor-pointer transition-all",
            !isRegister ? "bg-white text-text shadow-sm" : "bg-transparent text-text-muted"
          )}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => navigate('/auth/fan/register')}
          className={cn(
            "flex-1 h-[38px] border-none rounded-full font-sans text-sm font-semibold cursor-pointer transition-all",
            isRegister ? "bg-white text-text shadow-sm" : "bg-transparent text-text-muted"
          )}
        >
          Registration
        </button>
      </div>

      <SocialLogin provider="google" />
      <Divider />

      <form onSubmit={handleSubmit} noValidate>
        {isRegister && (
          <Input name="fullname" label="Full name" placeholder="Your full name" required />
        )}

        {isRegister && (
          <div className="flex bg-surface-subtle rounded-lg p-1 mb-4">
            <button
              type="button"
              onClick={() => setMethod('email')}
              className={cn(
                "flex-1 h-[34px] border-none rounded-md font-sans text-[13px] font-semibold cursor-pointer transition-all",
                method === 'email' ? "bg-white text-text shadow-sm" : "bg-transparent text-text-muted"
              )}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod('phone')}
              className={cn(
                "flex-1 h-[34px] border-none rounded-md font-sans text-[13px] font-semibold cursor-pointer transition-all",
                method === 'phone' ? "bg-white text-text shadow-sm" : "bg-transparent text-text-muted"
              )}
            >
              Phone
            </button>
          </div>
        )}

        {(!isRegister || method === 'email') && (
          <>
            <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
            <PasswordInput name="password" label={isRegister ? "Password" : "Password"} placeholder={isRegister ? "Create a password" : "Enter your password"} required />
          </>
        )}

        {isRegister && method === 'phone' && (
          <>
            <Input name="phone" type="tel" label="Phone number" placeholder="+1 (555) 000-0000" required />
            <Input name="code" type="text" label="Verification code" placeholder="6-digit code" className="font-mono" required />
          </>
        )}

        {!isRegister && (
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-[#344055] cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" />
              Remember me
            </label>
            <span onClick={() => navigate('/auth/fan/forgot-password')} className="text-sm text-brand font-medium cursor-pointer">
              Forgot password?
            </span>
          </div>
        )}

        {isRegister && (
          <label className="flex items-start gap-2 text-[13px] leading-snug text-text-muted cursor-pointer mb-6">
            <input name="terms" type="checkbox" required className="w-[18px] h-[18px] accent-brand cursor-pointer mt-px shrink-0" />
            I agree to the Terms of Service and Privacy Policy
          </label>
        )}

        <Button type="submit" fullWidth>
          Continue as Fan
        </Button>
      </form>
    </BaseAuthPage>
  )
}
