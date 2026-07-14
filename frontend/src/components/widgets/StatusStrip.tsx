import React from 'react';

export type StatusTone = 'nominal' | 'warning' | 'critical' | 'offline';

export interface StatusStripItem {
  label: string;
  value: string;
  tone?: StatusTone;
}

const TONE_COLOR: Record<StatusTone, string> = {
  nominal: '#1FAA6D',
  warning: '#D68A00',
  critical: '#C4291C',
  offline: '#94A3B8',
};

/** Generic wrapping status strip (used below the page header) — the same
 *  pattern as Platform Health / Live Operations Summary, generalized so
 *  every module can show its own live facts without ever overflowing. */
export const StatusStrip: React.FC<{ items: StatusStripItem[] }> = ({ items }) => (
  <div className="w-full flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 mb-5 bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
    {items.map((item, i) => (
      <React.Fragment key={item.label}>
        <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: TONE_COLOR[item.tone ?? 'nominal'] }}
            aria-hidden="true"
          />
          <span className="text-[13px] text-[#94A3B8]">{item.label}:</span>
          <span className="text-[13px] font-medium text-[#0F172A]">{item.value}</span>
        </div>
        {i < items.length - 1 && <div className="hidden sm:block w-px h-3.5 bg-[#E2E8F0] shrink-0" aria-hidden="true" />}
      </React.Fragment>
    ))}
  </div>
);
