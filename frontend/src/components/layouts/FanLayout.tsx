import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { OverlayProvider } from '@/contexts/OverlayContext'
import { authService } from '@/features/auth/services/authService'
import { Home, MapPin, Ticket, ShoppingBag, Sparkles } from 'lucide-react'
import { cn } from '@/utils/cn'

interface FanLayoutProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/fan' },
  { icon: MapPin, label: 'Navigate', path: '/fan/map' },
  { icon: Ticket, label: 'My Ticket', path: '/fan/ticket' },
  { icon: ShoppingBag, label: 'Store', path: '/fan/store' },
  { icon: Sparkles, label: 'AI', path: '/fan/ai' },
]

export const FanLayout: React.FC<FanLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    authService.logout()
    navigate('/auth/fan/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-white">
      <OverlayProvider>
        {/* Main content — no top header, all immersive */}
        <main className="w-full pb-[80px] lg:pb-0 lg:flex lg:min-h-screen">

          {/* Desktop sidebar (lg+) */}
          <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-[72px] xl:w-[220px] bg-[#111118] border-r border-white/[0.06] z-50">
            {/* Logo */}
            <div className="h-16 flex items-center px-4 xl:px-6 border-b border-white/[0.06]">
              <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="hidden xl:block ml-3 font-display font-bold text-white tracking-tight">PERIMO</span>
            </div>

            {/* Nav items */}
            <nav className="flex-1 flex flex-col gap-1 p-3">
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      'flex items-center gap-3 h-11 px-3 rounded-xl transition-all text-left',
                      active
                        ? 'bg-[#2563EB]/20 text-[#60A5FA]'
                        : 'text-white/40 hover:text-white/80 hover:bg-white/[0.06]'
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="hidden xl:block text-sm font-semibold">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-white/[0.06]">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 h-10 px-3 w-full rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all"
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="hidden xl:block text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Page content */}
          <div className="lg:ml-[72px] xl:ml-[220px] flex-1 min-w-0">
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111118]/90 backdrop-blur-xl border-t border-white/[0.08]">
          <div className="flex items-center justify-around py-2 px-2 safe-area-pb">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors"
                >
                  <item.icon className={cn('w-5 h-5', active ? 'text-[#60A5FA]' : 'text-white/40')} />
                  <span className={cn('text-[10px] font-semibold', active ? 'text-[#60A5FA]' : 'text-white/30')}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      </OverlayProvider>
    </div>
  )
}
