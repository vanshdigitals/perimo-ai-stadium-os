import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/utils/cn'
import { useScrollThreshold } from '@/hooks/useScrollThreshold'

interface HeaderProps {
  theme?: 'dark' | 'light'
  /** Rendered on the right, next to the FIFA badge. Omitted entirely (no
   *  layout gap left behind) on pages that don't manage a theme — e.g. the
   *  auth pages, which always render in light mode. */
  themeToggle?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ theme = 'light', themeToggle }) => {
  const isDark = theme === 'dark'
  const scrolled = useScrollThreshold(20)

  return (
    <header
      className={cn(
        // Sticky, glass nav — stays above everything and keeps its blur
        // whether the page has scrolled or not; only the shadow/border
        // opacity change on scroll, so there's never a hard cut.
        'sticky top-0 z-[100] h-[72px] shrink-0 flex items-center justify-between',
        'px-5 sm:px-8 lg:px-16 xl:px-20',
        'border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300',
        isDark
          ? cn('bg-[#0A0E14]/75 border-[#181D28]', scrolled && 'bg-[#0A0E14]/92 shadow-[0_8px_24px_rgba(0,0,0,0.28)]')
          : cn('bg-white/75 border-surface-border', scrolled && 'bg-white/92 shadow-[0_8px_24px_rgba(15,23,42,0.06)]')
      )}
    >
      <Link
        to="/"
        className="flex shrink-0 items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
      >
        <Logo theme={theme} />
      </Link>

      <div className="flex items-center gap-4 sm:gap-5">
        <div className={cn('hidden text-[13px] tracking-[0.01em] sm:block', isDark ? 'text-text-lightMuted' : 'text-text-muted')}>
          FIFA World Cup 2026
        </div>
        {themeToggle}
      </div>
    </header>
  )
}
