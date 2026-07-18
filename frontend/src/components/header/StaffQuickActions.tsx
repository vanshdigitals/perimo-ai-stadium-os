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
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-[#E2E8F0] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <h3 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-wider">Quick Actions</h3>
          </div>
          <div className="p-2 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto perimo-scrollbar">
            {actions.map((action, i) => (
              <button 
                key={i}
                onClick={() => handleAction(action.path)}
                className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group"
              >
                <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", action.bg, action.color)}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
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
