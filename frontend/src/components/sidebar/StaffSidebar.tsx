import React, { useEffect, useRef } from 'react'
import { 
  LayoutDashboard, CheckSquare, AlertTriangle, Map, DoorOpen, Users, 
  ScanLine, Clock, Radio, Bell, PackagePlus, Navigation,
  UserSquare, FileText, PhoneCall, Settings
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
      width="w-[260px]"
      collapsedWidth={isMobileDrawer ? "w-0" : "w-[64px]"}
    >
      <div className="flex flex-col h-full bg-white overflow-hidden border-r border-[#E2E8F0]">

        {/* Scrollable Upper Navigation */}
        <nav ref={scrollRef} className="flex-1 py-6 flex flex-col gap-8 overflow-y-auto perimo-scrollbar overflow-x-hidden">
          {NAV_GROUPS.map((group, idx) => (
            <div key={idx} className="flex flex-col">
              {group.label && (
                <div className={cn(
                  "text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase whitespace-nowrap transition-all duration-300",
                  isOpen ? "px-6 mb-3 opacity-100 h-auto visible translate-x-0" : "px-0 mb-0 opacity-0 h-0 invisible -translate-x-2 text-center"
                )}>
                  {group.label}
                </div>
              )}
              <div className="flex flex-col gap-1 px-3">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(`${item.path}/`))
                  return (
                    <button
                      key={item.label}
                      title={!isOpen ? item.label : undefined}
                      onClick={() => {
                        navigate(item.path)
                        if (isMobileDrawer) onToggle()
                      }}
                      className={cn(
                        "relative flex items-center h-[40px] rounded-[8px] text-[14px] transition-all duration-200 text-left group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap",
                        isOpen ? "px-3 gap-3" : "justify-center px-0 w-[40px] mx-auto",
                        isActive ? "bg-[#F1F5F9] text-[#0F172A] font-semibold" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium"
                      )}
                    >
                      {isActive && !isOpen && (
                        <div className="absolute top-[10px] bottom-[10px] w-1 rounded-r-full bg-[#0F172A] left-[-12px]" />
                      )}
                      <item.icon className={cn("shrink-0 w-5 h-5 transition-transform duration-200", isActive ? "text-[#0F172A]" : "text-[#94A3B8] group-hover:text-[#64748B] group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={cn("transition-all duration-300 ease-out", isOpen ? "opacity-100 translate-x-0 visible relative" : "opacity-0 -translate-x-2 invisible absolute pointer-events-none")}>
                        {item.label}
                      </span>
                      {isActive && isOpen && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Pinned Lower Navigation (Administration) */}
        <div className="shrink-0 pt-4 pb-6 bg-white z-10 border-t border-[#F1F5F9]">
          <div className={cn(
            "text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase whitespace-nowrap transition-all duration-300",
            isOpen ? "px-6 mb-3 opacity-100 h-auto visible translate-x-0" : "px-0 mb-0 opacity-0 h-0 invisible -translate-x-2 text-center"
          )}>
            {ADMIN_GROUP.label}
          </div>
          <div className="flex flex-col gap-1 px-3">
            {ADMIN_GROUP.items.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/staff' && location.pathname.startsWith(`${item.path}/`))
              return (
                <button
                  key={item.path}
                  title={!isOpen ? item.label : undefined}
                  onClick={() => {
                    navigate(item.path)
                    if (isMobileDrawer) onToggle()
                  }}
                  className={cn(
                    "relative flex items-center h-[40px] rounded-[8px] text-[14px] transition-all duration-200 text-left group outline-none focus-visible:ring-2 focus-visible:ring-blue-500 whitespace-nowrap",
                    isOpen ? "px-3 gap-3" : "justify-center px-0 w-[40px] mx-auto",
                    isActive ? "bg-[#F1F5F9] text-[#0F172A] font-semibold" : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] font-medium"
                  )}
                >
                  {isActive && !isOpen && (
                    <div className="absolute top-[10px] bottom-[10px] w-1 rounded-r-full bg-[#0F172A] left-[-12px]" />
                  )}
                  <item.icon className={cn("shrink-0 w-5 h-5 transition-transform duration-200", isActive ? "text-[#0F172A]" : "text-[#94A3B8] group-hover:text-[#64748B] group-hover:scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={cn("transition-all duration-300 ease-out", isOpen ? "opacity-100 translate-x-0 visible relative" : "opacity-0 -translate-x-2 invisible absolute pointer-events-none")}>
                    {item.label}
                  </span>
                  {isActive && isOpen && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </Drawer>
  )
}
