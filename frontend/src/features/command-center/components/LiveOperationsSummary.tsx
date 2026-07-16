import React from 'react';
import type { GateThroughput } from '@/features/digital-twin/types';
import { cn } from '@/utils/cn';

interface Props {
  gates: GateThroughput[];
}

export const LiveOperationsSummary: React.FC<Props> = ({ gates }) => {
  const openGates = gates.filter(g => g.securityStatus !== 'critical').length;
  const criticalGates = gates.filter(g => g.securityStatus === 'critical' || g.waitLevel === 'high').length;

  return (
    <div
      className="w-full flex flex-row overflow-x-auto items-center bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[12px] font-medium text-[#475569] divide-x divide-[#E2E8F0] hide-scrollbar"
      aria-label="Live Operations Summary"
    >
      <Chip label="Match" value="RMA vs BAR" valueClass="font-semibold text-[#0F172A]" />
      <Chip label="Venue" value="Santiago Bernabéu" />
      <Chip label="Attendance" value={<><span className="font-mono tabular-nums">82,414</span> <span className="text-[#D68A00] font-semibold">(98%)</span></>} />
      <Chip label="Weather" value="22°C Clear" />
      <Chip
        label="Gates"
        value={
          <span className="flex items-center gap-1.5">
            <span className="font-mono tabular-nums">{openGates}</span> open
            {criticalGates > 0 && (
              <span className="text-[10px] font-bold text-[#C4291C] bg-[#C4291C]/10 px-1.5 py-[2px] rounded-[4px] uppercase">
                {criticalGates} crit
              </span>
            )}
          </span>
        }
      />
      <Chip label="Security" value={<span className="text-[#1FAA6D] font-semibold">Nominal</span>} />
      <Chip label="Medical" value={<span className="text-[#1FAA6D] font-semibold">1 Active</span>} />
      <Chip label="Parking" value={<span className="font-mono tabular-nums">84%</span>} />
      <Chip label="Transport" value={<span className="text-[#1FAA6D] font-semibold">Nominal</span>} />
      <Chip label="Time" value={<span className="font-mono">21:15 CET</span>} />
    </div>
  );
};

const Chip: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-[#0F172A]',
}) => (
  <div className="flex-1 flex flex-col justify-center gap-0.5 px-4 py-2.5 min-w-max">
    <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.05em]">{label}</span>
    <span className={cn("text-[13px] truncate", valueClass)}>{value}</span>
  </div>
);
