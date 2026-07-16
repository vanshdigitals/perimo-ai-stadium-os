import React from 'react';
import { ChevronDown, User, Settings, Shield, Key, LogOut, CheckCircle2, Monitor, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useOverlay } from '@/contexts/OverlayContext';
import { cn } from '@/utils/cn';
import { t } from '@/i18n';

interface ProfileMenuProps {
  onLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onLogout }) => {
  const { isOpen, toggle, containerRef } = useOverlay('profile');
  const { user, theme, setTheme, language } = useApp();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    toggle();
    navigate(path);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          'flex items-center gap-2 p-1 pr-1.5 rounded-[10px] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
          isOpen ? 'bg-[#F1F5F9]' : 'hover:bg-[#F1F5F9]'
        )}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <div className="w-[30px] h-[30px] rounded-[8px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center text-[12px] font-semibold shrink-0 shadow-sm border border-[#1D4ED8]">
            {user.initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#1FAA6D] rounded-full border border-white" />
          </div>
        </div>
        <ChevronDown className={cn('w-3.5 h-3.5 text-[#94A3B8] hidden sm:block transition-transform duration-200', isOpen && 'rotate-180')} strokeWidth={2} />
      </button>

      {isOpen && (
        <div
          className="absolute top-[48px] right-0 w-[260px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] p-2 z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          role="menu"
        >
          {/* User Info */}
          <div className="px-3 py-3 border-b border-[#E2E8F0] mb-1.5 bg-[#F8FAFC] rounded-[10px]">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center text-[13px] font-bold shrink-0 shadow-sm">
                {user.initials}
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-[#0F172A] truncate">{user.displayName}</div>
                <div className="text-[12px] text-[#64748B] truncate">{user.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[11px] font-medium text-[#1FAA6D] bg-[#1FAA6D]/10 px-1.5 py-0.5 rounded-[4px]">
                <CheckCircle2 className="w-3 h-3" /> {t('profile.online', language)}
              </span>
              <span className="text-[11px] font-medium text-[#64748B] bg-[#E2E8F0] px-1.5 py-0.5 rounded-[4px]">
                {t('profile.commandCenter', language)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="px-3 mt-1 mb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Account</span>
            </div>
            <button
              onClick={() => handleNavigate('/admin/profile')}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors"
            >
              <User className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> {t('profile.myProfile', language)}
            </button>
            <button
              onClick={() => handleNavigate('/admin/workspace')}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors"
            >
              <Shield className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> {t('profile.workspace', language)}
            </button>
            <button
              onClick={() => handleNavigate('/admin/preferences')}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors"
            >
              <Settings className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> {t('profile.preferences', language)}
            </button>
            <button
              onClick={() => handleNavigate('/admin/security-settings')}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] text-[#334155] font-medium hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9] outline-none transition-colors"
            >
              <Key className="w-4 h-4 text-[#64748B]" strokeWidth={2} /> {t('profile.security', language)}
            </button>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-[#E2E8F0] flex flex-col gap-0.5">
            <div className="px-3 mt-1 mb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Theme</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors',
                  theme === 'light' ? 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] shadow-sm' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                )}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors',
                  theme === 'dark' ? 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] shadow-sm' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                )}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                onClick={() => setTheme('system')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors',
                  theme === 'system' ? 'bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] shadow-sm' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                )}
              >
                <Monitor className="w-3.5 h-3.5" /> System
              </button>
            </div>
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-[#E2E8F0]">
            <button
              onClick={onLogout}
              className="flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium text-[#E5342B] hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2] outline-none transition-colors"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} /> {t('profile.signOut', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
