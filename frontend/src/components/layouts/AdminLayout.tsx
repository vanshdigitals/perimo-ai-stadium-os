import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AdminSidebar } from '@/components/sidebar/AdminSidebar'
import { AdminHeader } from '@/components/header/AdminHeader'
import { UtilityPanel } from '@/features/utility-panel/components/UtilityPanel'
import { Backdrop } from '@/components/navigation/Backdrop'
import { MobileExperienceGate } from '@/components/layouts/MobileExperienceGate'
import { authService } from '@/features/auth/services/authService'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // Both drawers are hidden overlays by default (Slack/Notion style)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [utilityOpen, setUtilityOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [isTablet, setIsTablet] = useState(false)

  // Handle window resize for mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-close drawers on navigation
  useEffect(() => {
    setSidebarOpen(false)
    setUtilityOpen(false)
  }, [location])

  const handleLogout = () => {
    authService.logout()
    navigate('/auth/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans text-[#0F172A]">

      {/* Small-screen recommendation (non-blocking; admin panel only) */}
      <MobileExperienceGate />

      {/* Header ALWAYS 100% and Fixed at Top */}
      <AdminHeader
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleUtilityPanel={() => setUtilityOpen(!utilityOpen)}
        onLogout={handleLogout}
      />

      {/* Universal Backdrop */}
      <Backdrop
        isOpen={sidebarOpen || utilityOpen}
        onClick={() => { setSidebarOpen(false); setUtilityOpen(false) }}
      />

      {/* Overlay Drawers */}
      <AdminSidebar
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

      {/* Main Content */}
      <main className="flex-1 w-full pt-[72px] lg:pl-[72px]">
        <div className="max-w-[1600px] mx-auto p-6">
          {children}
        </div>
      </main>

    </div>
  )
}
