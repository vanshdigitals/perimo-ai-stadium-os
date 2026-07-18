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
      <header className="fixed top-0 left-0 right-0 h-[72px] flex items-center justify-between px-4 sm:px-6 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md z-[100] transition-all">
        
        {/* Left: Menu Toggle + Logo + Breadcrumb */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 w-1/3">
          <button
            onClick={onToggleSidebar}
            className="w-10 h-10 rounded-[10px] border border-[#E2E8F0] bg-white/50 flex items-center justify-center text-[#334155] hover:bg-[#F1F5F9] transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shadow-sm"
          >
            <Menu className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>

          <div className="hidden lg:flex items-center gap-2 mr-2">
            <div className="w-8 h-8 bg-[#0F172A] rounded-[8px] flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs tracking-widest">PV</span>
            </div>
            <span className="font-black text-[#0F172A] tracking-tight text-lg">PERIMO</span>
          </div>

          <div className="w-px h-6 bg-[#E2E8F0] hidden lg:block" />

          {/* Dynamic Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] min-w-0 h-[24px]">
            <span className="text-[#64748B] font-medium whitespace-nowrap hidden md:block">{breadcrumb.category}</span>
            <span className="text-[#CBD5E1] text-[12px] font-medium hidden md:block">/</span>
            <span className="text-[#0F172A] font-bold whitespace-nowrap overflow-hidden text-ellipsis leading-none">
              {breadcrumb.page}
            </span>
            <span className="ml-2 hidden xl:flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-[6px] border border-green-200 uppercase tracking-widest leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Live
            </span>
          </div>
        </div>

        {/* Center: Search (constrained width) */}
        <div className="flex-1 flex justify-center max-w-xl shrink px-4 hidden md:flex">
          <CommandPalette />
        </div>

        {/* Right Actions */}
        <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0 w-1/3">
          <NotificationCenter />
          <StaffQuickActions />
          
          <div className="hidden xl:block">
            <LanguageSwitcher />
          </div>
          
          <div className="w-px h-6 bg-[#E2E8F0] hidden sm:block mx-1" />
          
          <StaffProfileMenu onLogout={() => onLogout?.()} />
        </div>
        
      </header>
    </OverlayProvider>
  )
}
