import React from 'react';

export const UtilityFooter: React.FC = () => {
  return (
    <div className="p-4 border-t border-[#E2E8F0] bg-white sticky bottom-0 shrink-0 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase">Current Shift</span>
        <span className="text-[12px] font-bold text-[#0F172A]">Alpha (08:00 - 16:00)</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#64748B] uppercase">Operator</span>
        <span className="text-[12px] font-medium text-[#334155]">Sarah Jenkins</span>
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9]">
        <span className="text-[10px] text-[#94A3B8]">WebSocket Connected</span>
        <span className="text-[10px] text-[#94A3B8]">Synced Just Now</span>
      </div>
    </div>
  );
};
