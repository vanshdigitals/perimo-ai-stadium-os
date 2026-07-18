import React from 'react';
import { Bell } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';
import { useScrollThreshold } from '@/hooks/useScrollThreshold';
import { MATCH } from './data';

interface Props {
  isDark: boolean;
  themeToggle: React.ReactNode;
}

export const FanHomeHeader: React.FC<Props> = ({ isDark, themeToggle }) => {
  const scrolled = useScrollThreshold(20);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 h-[68px] shrink-0 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300',
        isDark
          ? cn('bg-[#0A0E14]/75 border-[#181D28]', scrolled && 'bg-[#0A0E14]/92 shadow-[0_8px_24px_rgba(0,0,0,0.28)]')
          : cn('bg-white/75 border-[#E2E4E9]', scrolled && 'bg-white/92 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'),
      )}
    >
      <div className="mx-auto flex h-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo theme={isDark ? 'dark' : 'light'} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Current match chip */}
          <div
            className={cn(
              'hidden items-center gap-2 rounded-full border py-1.5 pl-2.5 pr-3 sm:flex',
              isDark ? 'border-[#232838] bg-[#141822]' : 'border-[#E2E4E9] bg-white',
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-70 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
            </span>
            <span className="text-[13px]">{MATCH.home.flag} {MATCH.away.flag}</span>
            <span className={cn('text-[12.5px] font-semibold', isDark ? 'text-[#E5E9F0]' : 'text-[#0F172A]')}>
              {MATCH.home.short} <span className={isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]'}>vs</span> {MATCH.away.short}
            </span>
          </div>

          {/* Notification bell */}
          <button
            aria-label="Notifications (3 unread)"
            className={cn(
              'relative flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
              isDark ? 'text-[#C7CDD6] hover:bg-white/5' : 'text-[#475569] hover:bg-[#F1F5F9]',
            )}
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="absolute right-[7px] top-[6px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold text-white ring-2 ring-white">3</span>
          </button>

          {themeToggle}

          {/* Avatar */}
          <button
            aria-label="Your profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#6B4EFF] text-[13px] font-bold text-white shadow-sm outline-none ring-2 ring-white/0 transition-transform hover:scale-105 focus-visible:ring-[#2563EB]"
          >
            AB
          </button>
        </div>
      </div>
    </header>
  );
};
