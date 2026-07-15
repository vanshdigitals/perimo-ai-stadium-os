import React from 'react'
import { useNavigate } from 'react-router-dom'
import { OverlayProvider } from '@/contexts/OverlayContext'
import { NotificationCenter } from '@/components/navigation/NotificationBell'
import { ProfileMenu } from '@/components/navigation/ProfileMenu'
import { authService } from '@/features/auth/services/authService'

interface FanLayoutProps {
  children: React.ReactNode
}

export const FanLayout: React.FC<FanLayoutProps> = ({ children }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate('/auth/fan/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">
      <OverlayProvider>
        <header className="fixed top-0 left-0 right-0 h-[64px] flex items-center justify-between px-4 sm:px-6 border-b border-[#E2E8F0] bg-white z-[100]">
          
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/fan')}>
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg text-[#0F172A] tracking-tight hidden sm:block">
              Perimo Fan
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <div className="w-px h-6 bg-[#E2E8F0] mx-1" />
            <ProfileMenu onLogout={handleLogout} />
          </div>

        </header>
      </OverlayProvider>

      {/* Main Content */}
      <main className="flex-1 w-full pt-[64px]">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
