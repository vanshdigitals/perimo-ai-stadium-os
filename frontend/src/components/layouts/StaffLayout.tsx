import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Home, CheckSquare, ScanLine, Radio, AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { StaffSidebar } from '@/components/sidebar/StaffSidebar'
import { StaffHeader } from '@/components/header/StaffHeader'
import { Backdrop } from '@/components/navigation/Backdrop'
import { authService } from '@/features/auth/services/authService'

interface StaffLayoutProps {
  children: React.ReactNode
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location])

  const handleLogout = () => {
    authService.logout()
    navigate('/auth/staff/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">

      <StaffHeader
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      <Backdrop
        isOpen={sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />

      <StaffSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        isMobileDrawer={isMobile || isTablet}
      />

      <main className="flex-1 w-full pt-[72px] lg:pl-[72px] pb-[80px] md:pb-0">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <button 
          onClick={() => navigate('/staff/incidents')}
          className="md:hidden fixed bottom-[84px] right-4 w-14 h-14 bg-[#2563EB] text-white rounded-full shadow-[0_8px_16px_rgba(37,99,235,0.3)] flex items-center justify-center z-40 hover:bg-[#1D4ED8] transition-transform active:scale-95"
        >
          <AlertTriangle className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-[#E2E8F0] z-50 flex items-center justify-between px-2 pb-safe">
          {[
            { label: 'Home', icon: Home, path: '/staff' },
            { label: 'Tasks', icon: CheckSquare, path: '/staff/tasks' },
            { label: 'Scanner', icon: ScanLine, path: '/staff/scanner' },
            { label: 'Radio', icon: Radio, path: '/staff/comms' },
          ].map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                  isActive ? "text-[#2563EB]" : "text-[#64748B] hover:text-[#0F172A]"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-[#2563EB]/10")} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[10px] font-medium", isActive && "font-semibold")}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}

    </div>
  )
}
