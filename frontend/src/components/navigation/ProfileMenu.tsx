import React from 'react';
import { ChevronDown, User, Settings, Shield, Key, LogOut, CheckCircle2, Monitor, Moon, Sun } from 'lucide-react';
import { authService } from '@/features/auth/services/authService';
import { useOverlay } from '@/contexts/OverlayContext';
import { cn } from '@/utils/cn';

interface ProfileMenuProps {
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const { isOpen, toggle, containerRef } = useOverlay('profile');
  const user = authService.getCurrentUser();
  const initials = user?.displayName ? user.displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'SA';

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          "flex items-center gap-2 p-1 pr-1.5 rounded-[10px] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          isOpen ? "bg-[#F1F5F9]" : "hover:bg-[#F1F5F9]"
        )}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center text-[12px] font-semibold shrink-0 shadow-sm border border-[#1D4ED8]">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#1FAA6D] rounded-full border border-white" />
          </div>
        </div>
        <ChevronDown className={cn("w-3.5 h-3.5 text-[#94A3B8] hidden sm:block transition-transform duration-200", isOpen && "rotate-180")} strokeWidth={2} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-[48px] right-0 w-[260px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] p-2 z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          role="menu"
        >
          {/* User Info */}
          <div className="px-3 py-3 border-b border-[#E2E8F0] mb-1.5 bg-[#F8FAFC] rounded-[10px]">
            <div className="text-[13px] font-semibold text-[#0F172A] truncate">{user?.displayName || 'Stadium Admin'}</div>
            <div className="text-[12px] text-[#64748B] truncate mt-0.5">{user?.email || 'admin@perimo.io'}</div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#1FAA6D] bg-[#1FAA6D]/10 px-1.5 py-0.5 rounded-[4px]">
                <CheckCircle2 className="w-3 h-3" /> Online
              </span>
              <span className="text-[11px] font-medium text-[#64748B] bg-[#E2E8F0] px-1.5 py-0.5 rounded-[4px]">
                Command Center
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="px-3 mt-1 mb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Account</span>
            </div>
            <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors">
              <User className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> My Profile
            </button>
            <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors">
              <Shield className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> Workspace
            </button>
            <button className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors">
              <Settings className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> Preferences
            </button>
            <button className="flex items-center justify-between w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors">
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> Security & API Keys
              </div>
            </button>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-[#E2E8F0] flex flex-col gap-0.5">
             <div className="px-3 mt-1 mb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Theme</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] shadow-sm">
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-[#E2E8F0]">
            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium text-[#E5342B] hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2] outline-none transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
