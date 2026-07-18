import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Ticket, MapPin, UtensilsCrossed, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/features/role-selection/components/ThemeToggle';
import { FanHomeHeader } from '@/features/fan/home-showcase/FanHomeHeader';
import { FanHero } from '@/features/fan/home-showcase/FanHero';
import { QuickActions, LiveCards, BottomSections } from '@/features/fan/home-showcase/FanHomeSections';

const MOBILE_NAV = [
  { icon: Home, label: 'Home', path: '/fan' },
  { icon: MapPin, label: 'Navigate', path: '/fan/map' },
  { icon: Ticket, label: 'Ticket', path: '/fan/ticket' },
  { icon: UtensilsCrossed, label: 'Food', path: '/fan/food' },
  { icon: Sparkles, label: 'AI', path: '/fan/ai' },
];

export const FanHome: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Light is the guaranteed default for this showcase; the toggle still works.
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={cn('min-h-screen font-sans transition-colors duration-300', isDark ? 'bg-[#0A0E14] text-white' : 'bg-[#F8FAFC] text-[#0F172A]')}>
      <FanHomeHeader isDark={isDark} themeToggle={<ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />} />

      <main className="pb-24 md:pb-12">
        <FanHero isDark={isDark} onViewTicket={() => navigate('/fan/ticket')} />

        <div className="mx-auto max-w-[1240px] space-y-8 px-4 pt-6 sm:px-6 lg:px-8 lg:space-y-10">
          <QuickActions isDark={isDark} />
          <LiveCards isDark={isDark} />
          <BottomSections isDark={isDark} />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav className={cn('fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl md:hidden', isDark ? 'border-[#181D28] bg-[#0A0E14]/90' : 'border-[#E2E4E9] bg-white/90')} aria-label="Fan navigation">
        <div className="mx-auto flex max-w-[560px] items-center justify-around px-2 py-2">
          {MOBILE_NAV.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn('flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]', active ? 'text-[#2563EB]' : isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}
                aria-current={active ? 'page' : undefined}
              >
                <item.icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
