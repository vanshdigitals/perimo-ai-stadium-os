import React from 'react';

export type PillTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const TONE_STYLES: Record<PillTone, string> = {
  success: 'bg-[#1FAA6D]/10 text-[#1FAA6D] border-[#1FAA6D]/20',
  warning: 'bg-[#D68A00]/10 text-[#D68A00] border-[#D68A00]/20',
  danger: 'bg-[#C4291C]/10 text-[#C4291C] border-[#C4291C]/20',
  info: 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20',
  neutral: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
};

export const StatusPill: React.FC<{ label: string; tone?: PillTone; dot?: boolean }> = ({ label, tone = 'neutral', dot = false }) => (
  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border ${TONE_STYLES[tone]}`}>
    {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: 'currentColor' }} />}
    {label}
  </span>
);
