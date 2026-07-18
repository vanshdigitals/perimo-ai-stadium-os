import React, { useEffect, useRef } from 'react'
import { 
  LayoutDashboard, CheckSquare, AlertTriangle, Map, DoorOpen, Users, 
  ScanLine, Clock, Radio, Bell, PackagePlus, Navigation, 
  UserSquare, FileText, PhoneCall, Settings, HelpCircle 
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Drawer } from '@/components/navigation/Drawer'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_GROUPS = [
  {
    label: 'Operations',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/staff' },
      { label: 'My Tasks', icon: CheckSquare, path: '/staff/tasks' },
      { label: 'Incident Response', icon: AlertTriangle, path: '/staff/incidents' },
      { label: 'Staff Map', icon: Map, path: '/staff/map' },
      { label: 'Gate Operations', icon: DoorOpen, path: '/staff/gates' },
      { label: 'Crowd Monitoring', icon: Users, path: '/staff/crowd' },
      { label: 'Patrol Mode', icon: Navigation, path: '/staff/patrol' },
    ]
  },
  {
    label: 'Utilities',
    items: [
      { label: 'QR Scanner', icon: ScanLine, path: '/staff/scanner' },
      { label: 'Shift Management', icon: Clock, path: '/staff/shifts' },
      { label: 'Team Radio', icon: Radio, path: '/staff/comms' },
      { label: 'Notifications', icon: Bell, path: '/staff/notifications' },
      { label: 'Request Resources', icon: PackagePlus, path: '/staff/resources' },
    ]
  }
]

const ADMIN_GROUP = {
  label: 'Administration',
  items: [
    { label: 'My Profile', icon: UserSquare, path: '/staff/profile' },
    { label: 'Reports', icon: FileText, path: '/staff/reports' },
    { label: 'Emergency Mode', icon: PhoneCall, path: '/staff/emergency' },
    { label: 'Settings', icon: Settings, path: '/staff/settings' },
    { label: 'Help', icon: HelpCircle, path: '/staff/help' },
  ]
}

interface StaffSidebarProps {
  isOpen: boolean
  onToggle: () => void
  isMobileDrawer?: boolean
}

export const StaffSidebar: React.FC<StaffSidebarProps> = ({ isOpen, onToggle, isMobileDrawer = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const scrollRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const nav = scrollRef.current;
    if (!nav) return;
    const savedScroll = sessionStorage.getItem('perimoStaffSidebarScroll');
    if (savedScroll) {
      nav.scrollTop = parseInt(savedScroll, 10);
    }
    const handleScroll = () => {
      sessionStorage.setItem('perimoStaffSidebarScroll', nav.scrollTop.toString());
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
        
        {/* Scrollable Upper Navigation */}
        <nav ref={scrollRef} className="flex-1 py-4 flex flex-col gap-6 overflow-y-auto perimo-scrollbar overflow-x-hidden">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="flex flex-col">
              {group.label && (
                <div className={cn(
                  "text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase whitespace-nowrap transition-all duration-200",
                  isOpen ? "px-6 mb-2 opacity-100 h-auto visible translate-x-0" : "px-0 mb-0 opacity-0 h-0 invisible -translate-x-2"
                )}>
                  {group.label}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
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
                        isActive ? "bg-[#EFF6FF] text-[#1E40AF] font-medium" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-normal"
                      )}
                    >
                      {isActive && (
                        <div className={cn("absolute top-2 bottom-2 w-[3px] rounded-r-full bg-[#2563EB] transition-all duration-200", isOpen ? "left-[-12px]" : "left-[-8px]")} />
                      )}
                      <item.icon className={cn("shrink-0 w-5 h-5", isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#475569]")} strokeWidth={2} />
                      <span className={cn("transition-all duration-200 ease-out", isOpen ? "opacity-100 translate-x-0 visible relative" : "opacity-0 -translate-x-2 invisible absolute pointer-events-none")}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pinned Lower Navigation (Administration) */}
        <div className="shrink-0 pt-4 pb-4 border-t border-[#E2E8F0] flex flex-col bg-white z-10 shadow-[0_-4px_12px_rgba(255,255,255,0.9)]">
          <div className={cn(
            "text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase whitespace-nowrap transition-all duration-200",
            isOpen ? "px-6 mb-2 opacity-100 h-auto visible translate-x-0" : "px-0 mb-0 opacity-0 h-0 invisible -translate-x-2"
          )}>
            {ADMIN_GROUP.label}
          </div>
          <div className="flex flex-col gap-1">
            {ADMIN_GROUP.items.map((item) => {
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
                    "relative flex items-center h-[48px] rounded-[10px] text-[14px] transition-all duration-200 text-left group outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] whitespace-nowrap",
                    isOpen ? "px-3 gap-3 mx-3" : "justify-center mx-[8px] px-0",
                    isActive ? "bg-[#EFF6FF] text-[#1E40AF] font-medium" : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] font-normal"
                  )}
                >
                  {isActive && (
                    <div className={cn("absolute top-2 bottom-2 w-[3px] rounded-r-full bg-[#2563EB] transition-all duration-200", isOpen ? "left-[-12px]" : "left-[-8px]")} />
                  )}
                  <item.icon className={cn("shrink-0 w-[18px] h-[18px]", isActive ? "text-[#2563EB]" : "text-[#64748B] group-hover:text-[#475569]")} strokeWidth={2} />
                  <span className={cn("transition-all duration-200 ease-out", isOpen ? "opacity-100 translate-x-0 visible relative" : "opacity-0 -translate-x-2 invisible absolute pointer-events-none")}>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </Drawer>
  )
}
