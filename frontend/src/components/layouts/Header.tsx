import React from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/utils/cn'

interface HeaderProps {
  theme?: 'dark' | 'light'
}

export const Header: React.FC<HeaderProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark'
  
  return (
    <header className={cn(
      "h-[72px] shrink-0 flex items-center justify-between px-[clamp(20px,5vw,48px)] border-b transition-colors duration-200",
      isDark ? "bg-[#0A0E14] border-[#181D28]" : "bg-white border-surface-border"
    )}>
      <Link to="/" className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded">
        <Logo theme={theme} />
      </Link>
      <div className={cn(
        "text-[13px] tracking-[0.01em]",
        isDark ? "text-text-lightMuted" : "text-text-muted"
      )}>
        FIFA World Cup 2026
      </div>
    </header>
  )
}
