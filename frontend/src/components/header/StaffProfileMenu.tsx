import React, { useState, useRef, useEffect } from 'react'
import { User, Clock, Settings, HelpCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

interface StaffProfileMenuProps {
  onLogout: () => void
}

export const StaffProfileMenu: React.FC<StaffProfileMenuProps> = ({ onLogout }) => {
  const { user } = useApp()
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

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-[10px] hover:bg-[#F1F5F9] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <div className="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-bold text-[14px]">
          {user.name.charAt(0)}
        </div>
        <div className="hidden sm:flex flex-col items-start mr-2">
          <span className="text-[13px] font-bold text-[#0F172A] leading-none mb-1">{user.name}</span>
          <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider leading-none">{user.role}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[#E2E8F0] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] sm:hidden">
            <div className="text-[14px] font-bold text-[#0F172A]">{user.name}</div>
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mt-1">{user.role}</div>
          </div>
          <div className="p-2 flex flex-col gap-1">
            <button onClick={() => handleNavigate('/staff/profile')} className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left">
              <User className="w-4 h-4 shrink-0" /> My Profile
            </button>
            <button onClick={() => handleNavigate('/staff/shifts')} className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left">
              <Clock className="w-4 h-4 shrink-0" /> Shift Details
            </button>
            <button onClick={() => handleNavigate('/staff/settings')} className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left">
              <Settings className="w-4 h-4 shrink-0" /> Preferences
            </button>
          </div>
          <div className="p-2 border-t border-[#E2E8F0]">
            <button onClick={() => handleNavigate('/staff/help')} className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors text-left">
              <HelpCircle className="w-4 h-4 shrink-0" /> Support
            </button>
            <button onClick={() => { setIsOpen(false); onLogout(); }} className="flex items-center gap-3 w-full px-3 py-2 text-[13px] font-medium text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors text-left">
              <LogOut className="w-4 h-4 shrink-0" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
