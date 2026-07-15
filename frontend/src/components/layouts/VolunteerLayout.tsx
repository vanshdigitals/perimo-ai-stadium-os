import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { VolunteerSidebar } from '@/components/sidebar/VolunteerSidebar'
import { AdminHeader } from '@/components/header/AdminHeader'
import { Backdrop } from '@/components/navigation/Backdrop'
import { authService } from '@/features/auth/services/authService'

interface VolunteerLayoutProps {
  children: React.ReactNode
}

export const VolunteerLayout: React.FC<VolunteerLayoutProps> = ({ children }) => {
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
    navigate('/auth/volunteer/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">

      <AdminHeader
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleUtilityPanel={() => {}} // No utility panel for volunteers
        onLogout={handleLogout}
      />

      <Backdrop
        isOpen={sidebarOpen}
        onClick={() => { setSidebarOpen(false) }}
      />

      <VolunteerSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        isMobileDrawer={isMobile || isTablet}
      />

      <main className="flex-1 w-full pt-[72px] lg:pl-[72px]">
        <div className="max-w-[1200px] mx-auto p-4 sm:p-6">
          {children}
        </div>
      </main>

    </div>
  )
}
