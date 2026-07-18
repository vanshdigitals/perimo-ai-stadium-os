import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';

interface HeaderActionButtonProps {
  label: string;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  /** Provide a real action; when omitted, a toast is shown instead of a dead click. */
  onClick?: () => void;
  toastTitle?: string;
  toastMessage?: string;
  toastType?: 'success' | 'info' | 'warning' | 'error';
  fullWidth?: boolean;
  className?: string;
}

/**
 * HeaderActionButton — the standard page-header / panel action control.
 *
 * Guarantees no dead clicks: if no `onClick` is supplied it emits a toast so the
 * user always gets feedback. Centralises styling, focus rings and the toast so
 * every action button across the admin panel behaves and looks identically.
 */
export const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({
  label,
  icon: Icon,
  variant = 'secondary',
  onClick,
  toastTitle,
  toastMessage,
  toastType = 'success',
  fullWidth = false,
  className,
}) => {
  const { toast } = useApp();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    toast({ type: toastType, title: toastTitle ?? label, message: toastMessage });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'h-[36px] px-4 rounded-[8px] font-medium text-[13px] transition-colors flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] shrink-0',
        variant === 'primary'
          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] focus-visible:ring-offset-2'
          : 'border border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]',
        fullWidth && 'w-full',
        className,
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={2} />}
      {label}
    </button>
  );
};
