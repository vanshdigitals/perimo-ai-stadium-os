import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { StaffSidebar } from '@/components/sidebar/StaffSidebar'
import { AdminHeader } from '@/components/header/AdminHeader'
import { UtilityPanel } from '@/features/utility-panel/components/UtilityPanel'
import { Backdrop } from '@/components/navigation/Backdrop'
import { authService } from '@/features/auth/services/authService'

interface StaffLayoutProps {
  children: React.ReactNode
}

export const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [utilityOpen, setUtilityOpen] = useState(false)
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
    setUtilityOpen(false)
  }, [location])

  const handleLogout = () => {
    authService.logout()
    navigate('/auth/staff/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">

      <AdminHeader
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleUtilityPanel={() => setUtilityOpen(!utilityOpen)}
        onLogout={handleLogout}
      />

      <Backdrop
        isOpen={sidebarOpen || utilityOpen}
        onClick={() => { setSidebarOpen(false); setUtilityOpen(false) }}
      />

      <StaffSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        isMobileDrawer={isMobile || isTablet}
      />
      <UtilityPanel
        isOpen={utilityOpen}
        onClose={() => setUtilityOpen(false)}
        isMobile={isMobile}
        isTablet={isTablet}
      />

      <main className="flex-1 w-full pt-[72px] lg:pl-[72px]">
        <div className="max-w-[1600px] mx-auto p-6">
          {children}
        </div>
      </main>

    </div>
  )
}
