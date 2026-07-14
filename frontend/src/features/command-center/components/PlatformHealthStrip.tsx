import React from 'react';

// Each service row is a single live-data dependency.
// Deliberately non-collapsible and always full-width (as per IA spec §2, §8, §11).
const SERVICES = [
  { label: 'Platform',  status: 'nominal' as const },
  { label: 'Database',  status: 'nominal' as const },
  { label: 'API',       status: 'nominal' as const },
  { label: 'WebSocket', status: 'degraded' as const },
  { label: 'Maps',      status: 'nominal' as const },
  { label: 'AI',        status: 'nominal' as const },
  { label: 'Storage',   status: 'nominal' as const },
] as const;

const STATUS_CONFIG = {
  nominal:  { dot: 'bg-[#1FAA6D]', label: 'text-[#1FAA6D]', text: 'Nominal'  },
  degraded: { dot: 'bg-[#D68A00]', label: 'text-[#D68A00]', text: 'Degraded' },
  offline:  { dot: 'bg-[#C4291C]', label: 'text-[#C4291C]', text: 'Offline'  },
} as const;

export const PlatformHealthStrip: React.FC = () => {
  const hasIssue = SERVICES.some(s => s.status !== 'nominal');

  return (
    // flex-wrap (not overflow-x-auto) — at narrow widths this wraps to a second
    // line instead of ever producing a horizontal scrollbar. min-h keeps a stable
    // single-line height on any viewport wide enough to fit everything (>=1280px).
    <div
      className="w-full flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2.5 min-h-[52px] bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
      role="status"
      aria-label="Platform Health"
    >
      {/* Left: label + overall indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`w-1.5 h-1.5 rounded-full ${hasIssue ? 'bg-[#D68A00]' : 'bg-[#1FAA6D] animate-perimo-pulse'}`}
          aria-hidden="true"
        />
        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.06em] select-none">
          Platform Health
        </span>
      </div>

      <div className="hidden sm:block w-[1px] h-4 bg-[#E2E8F0] shrink-0" aria-hidden="true" />

      {/* Per-service rows */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 flex-1 min-w-0">
        {SERVICES.map((svc, i) => {
          const cfg = STATUS_CONFIG[svc.status];
          return (
            <React.Fragment key={svc.label}>
              <div className="flex items-center gap-1.5 shrink-0" title={`${svc.label}: ${cfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} aria-hidden="true" />
                <span className="text-[12px] font-medium text-[#475569]">{svc.label}</span>
              </div>
              {i < SERVICES.length - 1 && (
                <div className="hidden sm:block w-[1px] h-3 bg-[#E2E8F0] shrink-0" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Right: timestamp */}
      <span className="text-[11px] font-mono text-[#94A3B8] shrink-0 tabular-nums ml-auto">
        {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
      </span>
    </div>
  );
};
