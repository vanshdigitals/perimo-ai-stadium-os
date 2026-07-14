import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState: React.FC<{ icon?: React.ElementType; message: string; hint?: string }> = ({
  icon: Icon = Inbox,
  message,
  hint,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4">
    <Icon className="w-8 h-8 text-[#CBD5E1] mb-3" strokeWidth={1.5} />
    <p className="text-[13px] font-medium text-[#64748B]">{message}</p>
    {hint && <p className="text-[12px] text-[#94A3B8] mt-1">{hint}</p>}
  </div>
);
