import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: React.ElementType;
  message: string;
  hint?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  message,
  hint,
  className
}) => (
  <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6 h-full min-h-[240px] w-full", className)}>
    <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mb-5 shadow-sm">
      <Icon className="w-8 h-8 text-[#94A3B8]" strokeWidth={1.5} />
    </div>
    <h3 className="text-[15px] font-bold text-[#0F172A] mb-1.5">{message}</h3>
    {hint && <p className="text-[13px] font-medium text-[#64748B] max-w-[280px] leading-relaxed">{hint}</p>}
  </div>
);
