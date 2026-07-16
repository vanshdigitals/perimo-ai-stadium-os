import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/features/auth/services/authService'

export const FanWelcome: React.FC = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Auto transition to dashboard after 2.5 seconds
    const timer = setTimeout(() => navigate('/fan'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  const user = authService.getCurrentUser()
  const name = user?.displayName || 'Fan'

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-surface-subtle p-6 font-sans">
      <div className="w-full max-w-[420px] text-center animate-perimo-fade">
        <div className="mb-6 relative w-20 h-20 mx-auto">
          <svg className="absolute inset-0 w-full h-full text-brand animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="150 150" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-2 bg-brand rounded-full flex items-center justify-center shadow-lg shadow-brand/30 animate-in zoom-in duration-500 delay-150">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="font-display font-semibold text-[28px] text-text mb-3 tracking-tight animate-in slide-in-from-bottom-4 duration-700">
          Welcome to FIFA World Cup 2026™
        </h1>
        
        <p className="text-[16px] leading-[1.55] text-text-muted mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          Personalized for <span className="font-semibold text-text">{name}</span>
        </p>

        <div className="flex justify-center gap-1.5 animate-in fade-in duration-700 delay-300">
          <div className="w-2 h-2 rounded-full bg-brand/40 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-brand/60 animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-brand/80 animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}
