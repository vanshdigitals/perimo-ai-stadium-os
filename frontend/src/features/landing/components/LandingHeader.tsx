import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';
import { useScrollThreshold } from '@/hooks/useScrollThreshold';
import { NAV_LINKS } from '../data';

interface LandingHeaderProps {
  isDark: boolean;
  themeToggle: React.ReactNode;
  onGetStarted: () => void;
  onNavigate: (target: string) => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ isDark, themeToggle, onGetStarted, onNavigate }) => {
  const scrolled = useScrollThreshold(20);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (target: string) => {
    setMenuOpen(false);
    onNavigate(target);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-[100] h-[72px] shrink-0 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300',
        isDark
          ? cn('bg-[#0A0E14]/75 border-[#181D28]', scrolled && 'bg-[#0A0E14]/92 shadow-[0_8px_24px_rgba(0,0,0,0.28)]')
          : cn('bg-white/75 border-[#E2E4E9]', scrolled && 'bg-white/92 shadow-[0_8px_24px_rgba(15,23,42,0.06)]'),
      )}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-16 xl:px-20">
        <Link to="/" className="flex shrink-0 items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]" aria-label="PERIMO home">
          <Logo theme={isDark ? 'dark' : 'light'} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNav(link.target)}
              className={cn(
                'rounded-lg px-3.5 py-2 text-[14px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                isDark ? 'text-[#C7CDD6] hover:bg-white/5 hover:text-white' : 'text-[#475569] hover:bg-black/[0.04] hover:text-[#0F172A]',
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {themeToggle}
          <button
            onClick={onGetStarted}
            className="hidden h-[40px] items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 text-[14px] font-semibold text-white shadow-[0_4px_14px_rgba(37,99,235,0.28)] transition-all duration-200 hover:bg-[#1D4ED8] hover:shadow-[0_6px_18px_rgba(37,99,235,0.36)] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 sm:flex"
          >
            Get Started
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className={cn(
              'flex h-[40px] w-[40px] items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] md:hidden',
              isDark ? 'text-[#C7CDD6] hover:bg-white/5' : 'text-[#475569] hover:bg-black/[0.04]',
            )}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute inset-x-0 top-[72px] border-b p-4 backdrop-blur-xl md:hidden',
              isDark ? 'bg-[#0A0E14]/95 border-[#181D28]' : 'bg-white/95 border-[#E2E4E9]',
            )}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.target}
                  onClick={() => handleNav(link.target)}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-left text-[15px] font-medium transition-colors',
                    isDark ? 'text-[#C7CDD6] hover:bg-white/5' : 'text-[#334155] hover:bg-black/[0.04]',
                  )}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMenuOpen(false); onGetStarted(); }}
                className="mt-2 flex h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] text-[15px] font-semibold text-white"
              >
                Get Started <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
