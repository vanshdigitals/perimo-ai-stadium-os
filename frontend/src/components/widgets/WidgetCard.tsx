import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { ArrowDown } from 'lucide-react';

interface WidgetCardProps {
  title?: string;
  icon?: React.ElementType;
  iconColor?: string;
  live?: boolean;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  newContentCount?: number;
  onNewContentClick?: () => void;
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
  newContentCount = 0,
  onNewContentClick,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (newContentCount > 0) {
      setShowIndicator(true);
    } else {
      setShowIndicator(false);
    }
  }, [newContentCount]);

  const handleScrollToBottom = () => {
    if (onNewContentClick) {
      onNewContentClick();
    } else if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
    setShowIndicator(false);
  };

  return (
    <div
      className={cn(
        'bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col overflow-hidden h-full relative',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between px-5 h-[52px] border-b border-[#E2E8F0] shrink-0 bg-white z-10">
          <h3 className="text-[13px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
            {Icon && <Icon className="w-[15px] h-[15px]" style={{ color: iconColor }} strokeWidth={2} />}
            {title}
            {live && <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" aria-hidden="true" />}
          </h3>
          {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
        </div>
      )}
      <div 
        ref={scrollRef}
        className={cn(
          'flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-[#CBD5E1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-[#94A3B8]', 
          !noPadding && 'p-5', 
          bodyClassName
        )}
      >
        {children}
      </div>

      {/* New Content Indicator */}
      {showIndicator && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={handleScrollToBottom}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] text-white text-[12px] font-medium rounded-full shadow-lg hover:bg-[#1E293B] transition-all transform translate-y-0 opacity-100"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            {newContentCount} new event{newContentCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
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
    <Icon className="w-4 h-4" strokeWidth={2} />
  </button>
);
