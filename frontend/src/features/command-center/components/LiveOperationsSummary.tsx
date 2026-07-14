import React from 'react';
import type { GateThroughput } from '@/features/digital-twin/types';

// Extended TelemetryBar → Live Operations Summary strip.
// Per IA spec §1 (extend TelemetryBar), §6 (Strip 2), §10 (strip padding).
// Fixed height, full-width, never responsive-stacked.

interface Props {
  gates: GateThroughput[];
}

export const LiveOperationsSummary: React.FC<Props> = ({ gates }) => {
  const openGates = gates.filter(g => g.securityStatus !== 'critical').length;
  const criticalGates = gates.filter(g => g.securityStatus === 'critical' || g.waitLevel === 'high').length;

  return (
    // flex-wrap (not overflow-x-auto) — wraps to a second line at narrow widths
    // instead of ever producing a horizontal scrollbar.
    <div
      className="w-full flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5 min-h-[52px] bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-[13px] font-medium text-[#475569]"
      aria-label="Live Operations Summary"
    >
      <Chip label="Match" value="Real Madrid vs. Barcelona" valueClass="font-semibold text-[#0F172A]" />
      <Divider />
      <Chip label="Venue" value="Santiago Bernabéu" />
      <Divider />
      <Chip label="Attendance" value={<><span className="font-mono tabular-nums">82,414</span> <span className="text-[#D68A00] font-semibold">(98%)</span></>} />
      <Divider />
      <Chip label="Weather" value="22°C Clear" />
      <Divider />
      <Chip
        label="Gates"
        value={
          <>
            <span className="font-mono tabular-nums">{openGates}</span> open
            {criticalGates > 0 && (
              <span className="ml-1.5 text-[11px] font-semibold text-[#C4291C] bg-[#C4291C]/10 px-1.5 py-0.5 rounded-[4px]">
                {criticalGates} critical
              </span>
            )}
          </>
        }
      />
      <Divider />
      <Chip label="Security" value={<span className="text-[#1FAA6D] font-semibold">Nominal</span>} />
      <Divider />
      <Chip label="Medical" value={<span className="text-[#1FAA6D] font-semibold">1 Active</span>} />
      <Divider />
      <Chip label="Parking" value={<><span className="font-mono tabular-nums">84%</span></>} />
      <Divider />
      <Chip label="Transport" value={<span className="text-[#1FAA6D] font-semibold">Nominal</span>} />
      <Divider />
      <Chip label="Local Time" value={<span className="font-mono">21:15 CET</span>} />
    </div>
  );
};

const Divider: React.FC = () => (
  <div className="w-[1px] h-[14px] bg-[#E2E8F0] shrink-0" aria-hidden="true" />
);

const Chip: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-[#0F172A]',
}) => (
  <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
    <span className="text-[#94A3B8]">{label}:</span>
    <span className={valueClass}>{value}</span>
  </div>
);
