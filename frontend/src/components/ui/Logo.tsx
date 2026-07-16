import React from 'react'
import { cn } from '@/utils/cn'

import logoPng from '@/assets/logo/logo.png'

interface LogoProps {
  showText?: boolean
  className?: string
  /** Swaps the wordmark to light text for use on dark backgrounds (e.g. the public Header). */
  theme?: 'dark' | 'light'
}

export const Logo: React.FC<LogoProps> = ({ showText = true, className, theme = 'light' }) => {
  const isDark = theme === 'dark'
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img 
        src={logoPng} 
        alt="PERIMO Logo" 
        className="w-8 h-8 object-contain shrink-0" 
      />
      {showText && (
        <div className="min-w-0 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 flex flex-col justify-center items-start text-left">
          <div className={cn("font-display font-semibold text-[17px] tracking-[0.01em] leading-[1.1]", isDark ? "text-white" : "text-[#0F172A]")}>PERIMO</div>
          <div className={cn("text-[11px] leading-[1.1] font-medium tracking-wide", isDark ? "text-white/60" : "text-[#64748B]")}>AI Stadium OS</div>
        </div>
      )}
    </div>
  )
}

