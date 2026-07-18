import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OverlayProvider } from '@/contexts/OverlayContext';
import { authService } from '@/features/auth/services/authService';
import { Home, MapPin, Ticket, ShoppingBag, Sparkles, Bell, User } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { ThemeToggle } from '@/features/role-selection/components/ThemeToggle';
import { cn } from '@/utils/cn';

interface FanLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/fan' },
  { icon: MapPin, label: 'Navigate', path: '/fan/map' },
  { icon: Ticket, label: 'Tickets', path: '/fan/ticket' },
  { icon: ShoppingBag, label: 'Store', path: '/fan/store' },
  { icon: Sparkles, label: 'AI Guide', path: '/fan/ai' },
];

export const FanLayout: React.FC<FanLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/auth/fan/login', { replace: true });
  };

  const [isDark, setIsDark] = React.useState(false);

  return (
    <div className={cn("min-h-screen font-sans selection:bg-blue-500/30", isDark ? "bg-[#0A0E14] text-white" : "bg-slate-50 text-slate-900")}>
      <OverlayProvider>
        {/* Sticky Top Header (Desktop & Mobile) */}
        <header className={cn("sticky top-0 z-50 h-[64px] lg:h-[72px] backdrop-blur-xl border-b flex items-center justify-between px-4 lg:px-8", isDark ? "bg-[#0A0E14]/80 border-slate-800" : "bg-white/80 border-slate-200/60")}>
          <div className="flex items-center gap-3 lg:gap-6">
            <button onClick={() => navigate('/fan')} className="flex items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">
              <Logo theme={isDark ? "dark" : "light"} />
            </button>

            {/* Current Match Chip (Desktop only) */}
            <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200/50">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-600">ARG vs FRA</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <button className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-colors relative", isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-transparent" />
            </button>
            <div className={cn("w-px h-6 hidden lg:block mx-1", isDark ? "bg-slate-800" : "bg-slate-200")} />
            <button onClick={handleLogout} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all bg-white shadow-sm">
              <span className="text-sm font-semibold text-slate-700 hidden lg:block ml-2">Alex</span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-400" />
              </div>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full pb-[90px] lg:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 pb-safe">
          <div className="flex items-center justify-around px-2 py-2">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 p-2 min-w-[64px]"
                >
                  <div className={cn(
                    "w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    active ? "bg-blue-100/80 text-blue-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  )}>
                    <item.icon className={cn("w-5 h-5 transition-transform duration-300", active && "scale-110")} />
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold transition-colors",
                    active ? "text-blue-600" : "text-slate-500"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </OverlayProvider>
    </div>
  );
};
