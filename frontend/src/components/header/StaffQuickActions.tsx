import React, { useState, useRef, useEffect } from 'react'
import { Plus, AlertTriangle, Activity, ScanLine, Navigation, AlertOctagon, Radio, Clock, FileText, PackagePlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export const StaffQuickActions: React.FC = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAction = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  const actions = [
    { label: 'Report Incident', icon: AlertTriangle, path: '/staff/incidents', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Emergency SOS', icon: AlertOctagon, path: '/staff/emergency', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Call Medical', icon: Activity, path: '/staff/resources', color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Request Backup', icon: PackagePlus, path: '/staff/resources', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Open Scanner', icon: ScanLine, path: '/staff/scanner', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Start Patrol', icon: Navigation, path: '/staff/patrol', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Broadcast to Team', icon: Radio, path: '/staff/comms', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'Shift Check In/Out', icon: Clock, path: '/staff/shifts', color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: 'Generate Report', icon: FileText, path: '/staff/reports', color: 'text-violet-600', bg: 'bg-violet-50' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[36px] h-[36px] rounded-[8px] bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1D4ED8] transition-colors shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
        title="Quick Actions"
      >
        <Plus className="w-5 h-5" strokeWidth={2.5} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#E2E8F0] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-[#F1F5F9] bg-[#F8FAFC]">
            <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Quick Actions</h3>
          </div>
          <div className="p-3 grid grid-cols-2 gap-2">
            {actions.map((action, i) => (
              <button 
                key={i}
                onClick={() => handleAction(action.path)}
                className="flex flex-col items-center justify-center gap-2 w-full p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors text-center group border border-transparent hover:border-[#E2E8F0]"
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", action.bg, action.color)}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
