import React from 'react';

export const TelemetryBar: React.FC = () => {
  return (
    <div className="flex items-center gap-6 text-[13px] font-medium text-[#475569] bg-white border border-[#E2E8F0] px-5 py-3 rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-x-auto">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#94A3B8]">Match:</span>
        <span className="text-[#0F172A] font-semibold">Real Madrid vs. Barcelona</span>
      </div>
      <div className="w-[1px] h-[14px] bg-[#E2E8F0] shrink-0" />
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#94A3B8]">Venue:</span>
        <span className="text-[#0F172A]">Santiago Bernabéu</span>
      </div>
      <div className="w-[1px] h-[14px] bg-[#E2E8F0] shrink-0" />
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#94A3B8]">Attendance:</span>
        <span className="text-[#0F172A] font-mono font-medium tabular-nums">
          82,414 <span className="text-[#D68A00] font-semibold">(98%)</span>
        </span>
      </div>
      <div className="w-[1px] h-[14px] bg-[#E2E8F0] shrink-0" />
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#94A3B8]">Weather:</span>
        <span className="text-[#0F172A]">22°C Clear</span>
      </div>
      <div className="w-[1px] h-[14px] bg-[#E2E8F0] shrink-0" />
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#94A3B8]">Local Time:</span>
        <span className="text-[#0F172A] font-mono font-medium">21:15 CET</span>
      </div>
    </div>
  );
};
