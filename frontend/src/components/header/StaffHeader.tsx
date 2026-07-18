import React, { useMemo } from 'react'
import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { OverlayProvider } from '@/contexts/OverlayContext'
import { NotificationCenter } from '@/components/navigation/NotificationBell'
import { LanguageSwitcher } from '@/components/navigation/LanguageSwitcher'
import { CommandPalette } from '@/components/navigation/CommandPalette'
import { StaffQuickActions } from './StaffQuickActions'
import { StaffProfileMenu } from './StaffProfileMenu'

interface StaffHeaderProps {
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  onLogout?: () => void
}

const ROUTE_MAP: Record<string, { category: string; page: string }> = {
  '/staff': { category: 'Operations', page: 'Dashboard' },
  '/staff/tasks': { category: 'Operations', page: 'My Tasks' },
  '/staff/incidents': { category: 'Operations', page: 'Incident Response' },
  '/staff/map': { category: 'Operations', page: 'Staff Map' },
  '/staff/gates': { category: 'Operations', page: 'Gate Operations' },
  '/staff/crowd': { category: 'Operations', page: 'Crowd Monitoring' },
  '/staff/patrol': { category: 'Operations', page: 'Patrol Mode' },
  '/staff/scanner': { category: 'Utilities', page: 'QR Scanner' },
  '/staff/shifts': { category: 'Utilities', page: 'Shift Management' },
  '/staff/comms': { category: 'Utilities', page: 'Team Radio' },
  '/staff/notifications': { category: 'Utilities', page: 'Notifications' },
  '/staff/resources': { category: 'Utilities', page: 'Request Resources' },
  '/staff/profile': { category: 'Administration', page: 'My Profile' },
  '/staff/reports': { category: 'Administration', page: 'Reports' },
  '/staff/emergency': { category: 'Administration', page: 'Emergency Mode' },
  '/staff/settings': { category: 'Administration', page: 'Settings' },
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ onToggleSidebar, onLogout }) => {
  const location = useLocation()

  const breadcrumb = useMemo(() => {
    if (ROUTE_MAP[location.pathname]) return ROUTE_MAP[location.pathname]
    return { category: 'Staff', page: 'Dashboard' }
  }, [location.pathname])

  return (
    <OverlayProvider>
      <header className="fixed top-0 left-0 right-0 h-[72px] flex items-center gap-4 px-4 sm:px-6 border-b border-[#E2E8F0] bg-white z-[100]">
        
        {/* Left: Menu Toggle + Breadcrumb */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-[10px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#334155] hover:bg-[#F1F5F9] transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <Menu className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>

          {/* Dynamic Breadcrumb */}
          <div className="flex items-center gap-2.5 text-[14px] min-w-0 h-[24px]">
            <span className="text-[#64748B] font-medium whitespace-nowrap hidden sm:block">Staff Ops</span>
            <span className="text-[#94A3B8] text-[12px] font-medium hidden sm:block">/</span>
            <span className="text-[#64748B] font-medium whitespace-nowrap hidden md:block">{breadcrumb.category}</span>
            <span className="text-[#94A3B8] text-[12px] font-medium hidden md:block">/</span>
            <span className="text-[#0F172A] font-semibold whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              {breadcrumb.page}
            </span>
            <span className="ml-1.5 hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-[#1FAA6D] bg-[#1FAA6D]/10 px-2 py-0.5 rounded-[4px] uppercase tracking-wider leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
              System Live
            </span>
          </div>
        </div>

        {/* Search */}
        <CommandPalette />

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          <NotificationCenter />
          <StaffQuickActions />
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          <div className="w-px h-6 bg-[#E2E8F0] mx-1 shrink-0 hidden sm:block" />
          
          <StaffProfileMenu onLogout={() => onLogout?.()} />
        </div>
        
      </header>
    </OverlayProvider>
  )
}
