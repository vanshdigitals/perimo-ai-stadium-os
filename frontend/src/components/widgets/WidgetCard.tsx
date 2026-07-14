import React from 'react';
import { cn } from '@/utils/cn';

interface WidgetCardProps {
  title?: string;
  icon?: React.ElementType;
  iconColor?: string;
  live?: boolean;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  children: React.ReactNode;
}

/**
 * The one card shell every widget in the app should render inside.
 * Centralizes the header pattern (icon + title + live dot + actions slot)
 * so individual widgets only ever define their body content.
 */
export const WidgetCard: React.FC<WidgetCardProps> = ({
  title,
  icon: Icon,
  iconColor = '#64748B',
  live = false,
  actions,
  className,
  bodyClassName,
  noPadding = false,
  children,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col overflow-hidden h-full',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-5 h-[52px] border-b border-[#E2E8F0] shrink-0">
          <h3 className="text-[13px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
            {Icon && <Icon className="w-[15px] h-[15px]" style={{ color: iconColor }} strokeWidth={2} />}
            {title}
            {live && <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" aria-hidden="true" />}
          </h3>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn('flex-1 min-h-0', !noPadding && 'p-5', bodyClassName)}>{children}</div>
    </div>
  );
};

export const WidgetHeaderButton: React.FC<{ icon: React.ElementType; label: string; onClick?: () => void }> = ({
  icon: Icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    aria-label={label}
    title={label}
    className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
  >
    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
  </button>
);
