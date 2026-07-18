import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BaseAuthPage } from '../shared/BaseAuthPage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { authService } from '@/features/auth/services/authService'

export const FanRegistration: React.FC = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState<number>(1)
  const [errorMsg, setErrorMsg] = useState<string | undefined>()

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    const form = e.currentTarget as HTMLFormElement
    const required = Array.from(form.querySelectorAll('[required]')) as HTMLInputElement[]
    const missing = required.some((el) => !el.value || !el.value.trim())
    
    if (missing && (step === 1 || step === 2)) {
      setErrorMsg('Please fill in all required fields to continue.')
      return
    }
    setErrorMsg(undefined)

    if (step < 5) {
      setStep(step + 1)
    } else {
      // Finish registration
      const email = 'fan@perimo.io'
      authService.createSession(email, 'fan')
      navigate('/auth/fan/verify')
    }
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
      badgeText={`STEP ${step} OF 5`}
      title="Create your Fan account"
      subtitle="Join Perimo to unlock AI-powered stadium experiences."
      footerText="Fan accounts are self-service and free for all ticket holders."
      errorMsg={errorMsg}
      backLink="/get-started#fan"
    >
      <div className="flex bg-surface-subtle rounded-full p-1 mb-6">
        <button
          type="button"
          onClick={() => navigate('/auth/fan/login')}
          className="flex-1 h-[38px] border-none rounded-full font-sans text-sm font-semibold cursor-pointer transition-all bg-transparent text-text-muted"
        >
          Log In
        </button>
        <button
          type="button"
          className="flex-1 h-[38px] border-none rounded-full font-sans text-sm font-semibold cursor-pointer transition-all bg-white text-text shadow-sm"
        >
          Registration
        </button>
      </div>

      <form onSubmit={handleNext} noValidate className="animate-perimo-fade transition-all">
        {step === 1 && (
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-text mb-4">Basic Information</h3>
            <Input name="fullname" label="Full name" placeholder="Your full name" required />
            <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
            <Input name="phone" type="tel" label="Mobile Number" placeholder="+1 (555) 000-0000" required />
            <Input name="country" label="Country" placeholder="United States" required />
            <Input name="language" label="Preferred Language" placeholder="English" required />
            <Button type="submit" fullWidth className="mt-2">Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-text mb-4">Match Information</h3>
            <Input name="match" label="Match" placeholder="Quarter Final 1" required />
            <Input name="stadium" label="Stadium" placeholder="MetLife Stadium" required />
            <Input name="ticket" label="Ticket Number" placeholder="TCK-992-817" required />
            <Input name="seat" label="Seat Number" placeholder="Section 112, Row 8, Seat 15" required />
            <Button type="submit" fullWidth className="mt-2">Next</Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-text mb-2">Preferences</h3>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Food Preferences (Vegetarian, Halal, etc.)
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Accessibility Needs
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Receive Notifications
            </label>
            <Input name="team" label="Favourite Team" placeholder="Argentina" className="mt-2" />
            <Button type="submit" fullWidth className="mt-4">Continue</Button>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-text mb-2">Permissions</h3>
            <p className="text-[13px] text-text-muted mb-4">We need these permissions to provide live navigation and contextual AI assistance inside the stadium.</p>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" defaultChecked className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Location (Required for Navigation)
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" defaultChecked className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Notifications (Live Updates)
            </label>
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input type="checkbox" defaultChecked className="w-[18px] h-[18px] accent-brand cursor-pointer" /> Camera (QR Scanning)
            </label>
            <Button type="submit" fullWidth className="mt-6">Continue</Button>
          </div>
        )}

        {step === 5 && (
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-text mb-2">AI Personalization</h3>
            <p className="text-[13px] text-text-muted mb-4">Help our AI Copilot tailor your experience.</p>
            
            <label className="text-sm font-medium mb-1 block">Who are you attending with?</label>
            <select className="h-[44px] w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 text-[15px] outline-none mb-4">
              <option>Family with Kids</option>
              <option>Friends</option>
              <option>Solo</option>
            </select>

            <label className="text-sm font-medium mb-1 block">Primary Goal?</label>
            <select className="h-[44px] w-full rounded-lg border border-[#D0D5DD] bg-white px-3.5 text-[15px] outline-none mb-4">
              <option>Enjoying the Match</option>
              <option>Food & Merchandise</option>
              <option>Exploring the Stadium</option>
            </select>

            <Button type="submit" fullWidth className="mt-4">Complete Registration</Button>
          </div>
        )}
      </form>
    </BaseAuthPage>
  )
}
