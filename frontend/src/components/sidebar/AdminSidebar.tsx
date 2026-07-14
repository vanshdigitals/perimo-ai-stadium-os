import React, { useEffect, useRef } from 'react'
import { 
  LayoutDashboard, Activity, UsersRound, Box, AlertTriangle, 
  Truck, Building2, Shield, Brain, BarChart3, Users, UserCheck, 
  Bell, FileText, Settings, HelpCircle, BookOpen, LifeBuoy
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Drawer } from '@/components/navigation/Drawer'
import { useNavigate, useLocation } from 'react-router-dom'

// Group Data
const NAV_GROUPS = [
  {
    label: '',
    items: [
      { label: 'Command Center', icon: LayoutDashboard, path: '/admin' },
      { label: 'Live Operations', icon: Activity, path: '/admin/live-ops' },
      { label: 'Crowd Intelligence', icon: UsersRound, path: '/admin/crowd' },
      { label: 'Digital Twin', icon: Box, path: '/admin/digital-twin' },
      { label: 'Incident Center', icon: AlertTriangle, path: '/admin/incidents' },
      { label: 'Transportation', icon: Truck, path: '/admin/transportation' },
      { label: 'Facilities', icon: Building2, path: '/admin/facilities' },
      { label: 'Security', icon: Shield, path: '/admin/security' },
      { label: 'AI Center', icon: Brain, path: '/admin/ai' },
      { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ]
  },
  {
    label: 'ADMINISTRATION',
    items: [
      { label: 'User Management', icon: Users, path: '/admin/users' },
      { label: 'Roles & Permissions', icon: UserCheck, path: '/admin/roles' },
      { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
      { label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs' },
      { label: 'Platform Settings', icon: Settings, path: '/admin/settings' },
    ]
  }
]

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
  isMobileDrawer?: boolean
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onToggle, isMobileDrawer = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const scrollRef = useRef<HTMLElement>(null)

  // Scroll State Persistence
  useEffect(() => {
    const nav = scrollRef.current;
    if (!nav) return;

    // Restore scroll position
    const savedScroll = sessionStorage.getItem('perimoSidebarScroll');
    if (savedScroll) {
      nav.scrollTop = parseInt(savedScroll, 10);
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      sessionStorage.setItem('perimoSidebarScroll', nav.scrollTop.toString());
    };

    nav.addEventListener('scroll', handleScroll, { passive: true });
    return () => nav.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onToggle} 
      position="left" 
      width="w-[280px]" 
      collapsedWidth={isMobileDrawer ? "w-0" : "w-[72px]"}
    >
      <div className="flex flex-col h-full bg-white overflow-hidden">
        
        {/* Scrollable Navigation */}
        <nav 
          ref={scrollRef}
          className="flex-1 py-4 flex flex-col gap-6 overflow-y-auto perimo-scrollbar overflow-x-hidden"
        >
          
          {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="flex flex-col">
            {group.label && (
              <div 
                className={cn(
                  "text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase whitespace-nowrap transition-all duration-200",
                  isOpen ? "px-6 mb-2 opacity-100 h-auto visible translate-x-0" : "px-0 mb-0 opacity-0 h-0 invisible -translate-x-2"
                )}
              >
                {group.label}
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.label}
                    title={!isOpen ? item.label : undefined}
                    onClick={() => {
                      navigate(item.path)
                      if (isMobileDrawer) onToggle()
                    }}
                    className={cn(
                      "relative flex items-center h-[48px] rounded-[10px] text-[14px] transition-all duration-200 text-left group outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] whitespace-nowrap",
                      isOpen ? "px-3 gap-3 mx-3" : "justify-center mx-[8px] px-0",
                      isActive
                        ? "bg-[#EFF6FF] text-[#1E40AF] font-medium"
                        : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-normal"
                    )}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <div className={cn(
                        "absolute top-2 bottom-2 w-[3px] rounded-r-full bg-[#2563EB] transition-all duration-200",
                        isOpen ? "left-[-12px]" : "left-[-8px]"
                      )} />
                    )}
                    
                    <item.icon className={cn(
                      "shrink-0 w-5 h-5",
                      isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#475569]"
                    )} strokeWidth={2} />
                    
                    <span className={cn(
                      "transition-all duration-200 ease-out",
                      isOpen 
                        ? "opacity-100 translate-x-0 visible relative" 
                        : "opacity-0 -translate-x-2 invisible absolute pointer-events-none"
                    )}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        </nav>

        {/* Fixed Bottom Actions (Never scrolls) */}
        <div className="shrink-0 pt-3 pb-4 border-t border-[#E2E8F0] flex flex-col gap-1 bg-white z-10 shadow-[0_-4px_12px_rgba(255,255,255,0.9)]">
          {[
            { label: 'Help', icon: HelpCircle, path: '/admin/help' },
            { label: 'Documentation', icon: BookOpen, path: '/admin/docs' },
            { label: 'Support', icon: LifeBuoy, path: '/admin/support' },
          ].map((item) => {
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                title={!isOpen ? item.label : undefined}
                onClick={() => {
                  navigate(item.path)
                  if (isMobileDrawer) onToggle()
                }}
                className={cn(
                  "relative flex items-center h-[48px] rounded-[10px] text-[13px] transition-all duration-200 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                  isOpen ? "px-3 gap-3 mx-3" : "justify-center mx-[8px] px-0",
                  isActive ? "bg-[#EFF6FF] text-[#1E40AF] font-medium" : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                )}
              >
                <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
                <span className={cn(
                  "transition-all duration-200 ease-out",
                  isOpen ? "opacity-100 translate-x-0 visible relative" : "opacity-0 -translate-x-2 invisible absolute pointer-events-none"
                )}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </Drawer>
  )
}


