import React from 'react'
import { cn } from '@/utils/cn'

interface RoleCardProps {
  title: string
  description: string
  badgeText: string
  icon: React.ReactNode
  buttonText: string
  onClick: () => void
  isPrimary?: boolean
  badgeTheme?: 'primary' | 'secondary' | 'dark'
}

export const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  badgeText,
  icon,
  buttonText,
  onClick,
  isPrimary = false,
  badgeTheme = 'secondary',
}) => {
  return (
    <div
      className={cn(
        "bg-white border rounded-[20px] flex flex-col transition-all duration-220 group",
        isPrimary
          ? "border-brand/30 p-[clamp(24px,3vw,32px)] hover:border-brand/60 hover:shadow-[0_0_0_1px_rgba(22,82,240,0.25),0_8px_28px_rgba(22,82,240,0.12)] hover:-translate-y-0.5"
          : "border-surface-border p-[clamp(24px,3vw,32px)] hover:border-brand/40 hover:shadow-[0_0_0_1px_rgba(22,82,240,0.15),0_8px_28px_rgba(22,82,240,0.08)] hover:-translate-y-0.5"
      )}
    >
      <div className="flex items-center justify-between mb-[18px]">
        <div
          className={cn(
            "w-11 h-11 rounded-md flex items-center justify-center",
            badgeTheme === 'primary' && "bg-brand/10 text-brand",
            badgeTheme === 'secondary' && "bg-surface-subtle text-text-muted",
            badgeTheme === 'dark' && "bg-brand/10 text-brand"
          )}
        >
          {icon}
        </div>
        <span
          className={cn(
            "text-[11px] font-semibold tracking-[0.03em] px-2.5 py-1.5 rounded-full",
            badgeTheme === 'primary' && "bg-brand/10 text-brand",
            badgeTheme === 'secondary' && "bg-surface-subtle text-text-muted",
            badgeTheme === 'dark' && "bg-brand/10 text-brand"
          )}
        >
          {badgeText}
        </span>
      </div>
      <h2 className="font-display font-semibold text-[19px] text-text mb-2">
        {title}
      </h2>
      <p className="text-sm leading-[1.55] text-text-muted mb-6 flex-1">
        {description}
      </p>
      <button
        onClick={onClick}
        className={cn(
          "mt-auto h-12 rounded-lg font-sans font-semibold text-[15px] transition-colors px-5",
          isPrimary
            ? "bg-brand text-white border-none hover:bg-brand-hover"
            : "bg-white text-text border border-surface-border hover:bg-surface-subtle"
        )}
      >
        {buttonText}
      </button>
    </div>
  )
}
