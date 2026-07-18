import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '../shared/BaseAuthPage'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'
import { DemoCredentialsCard } from '@/features/auth/shared/DemoCredentialsCard'

export const StaffAuth: React.FC = () => {
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
    
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value || 'staff@perimo.io'
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value || 'dummy'
    
    const result = authService.loginDemo(email, password)
    if (!result.success) {
      setErrorMsg('Invalid credentials.')
      return
    }
    
    authService.createSession(email, 'staff')
    
    navigate('/auth/success', { state: { kind: 'staff-login' } })
  }

  const icon = (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )

  return (
    <BaseAuthPage
      icon={icon}
      iconWrapperClass="bg-[#F0F1F3] text-[#344055]"
      badgeText="PRE-CREATED ACCOUNTS"
      title="Staff sign in"
      subtitle="Sign in to access operations, security, medical and transport tools."
      footerText="Staff accounts are provisioned by your stadium operations administrator."
      errorMsg={errorMsg}
      demoCard={<DemoCredentialsCard role="Staff" email="staff@perimo.io" password="Staff@123" />}
      backLink="/get-started#staff"
    >
      <form onSubmit={handleSubmit} noValidate>
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

        <Button type="submit" fullWidth>
          Staff Login
        </Button>
      </form>
    </BaseAuthPage>
  )
}
