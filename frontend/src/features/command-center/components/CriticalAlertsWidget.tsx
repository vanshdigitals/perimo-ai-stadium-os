import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronRight } from 'lucide-react';

// Per IA spec §5: absorbs Emergency Queue + timeline as a pinned top section + Feed/Timeline tabs.
// Per IA spec §6: ~42% width, tallest of the bottom row.
// Emergency response timer (elapsed count-up) per IA spec §2.

interface Alert {
  id: string;
  title: string;
  location: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'info';
  status: 'Active' | 'Responding' | 'Monitoring' | 'Resolved';
  startedAt: number; // ms epoch
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: 'a1',
    title: 'Medical Assistance Required',
    location: 'Sec B Row 18',
    description: 'Immediate medical response dispatched.',
    severity: 'critical',
    status: 'Responding',
    startedAt: Date.now() - 134_000, // 2m 14s ago
  },
  {
    id: 'a2',
    title: 'Gate C Congestion',
    location: 'Gate C',
    description: 'Crowd density exceeded 92%. Consider overflow routing.',
    severity: 'high',
    status: 'Active',
    startedAt: Date.now() - 240_000, // 4m ago
  },
  {
    id: 'a3',
    title: 'Parking Zone P2 Full',
    location: 'Parking P2',
    description: 'Capacity reached 98%. Redirecting vehicles.',
    severity: 'medium',
    status: 'Monitoring',
    startedAt: Date.now() - 480_000,
  },
  {
    id: 'a4',
    title: 'Network Latency Spike',
    location: 'Control Room',
    description: 'Minor lag in broadcast feed. Auto-recovering.',
    severity: 'info',
    status: 'Resolved',
    startedAt: Date.now() - 900_000,
  },
];

const SEVERITY_CONFIG = {
  critical: { border: '#C4291C', icon: AlertTriangle, iconColor: '#C4291C', statusBg: '#C4291C1a', statusText: '#C4291C' },
  high:     { border: '#EA580C', icon: AlertCircle,   iconColor: '#EA580C', statusBg: '#F1F5F9',    statusText: '#475569'  },
  medium:   { border: '#F59E0B', icon: AlertTriangle, iconColor: '#F59E0B', statusBg: '#F1F5F9',    statusText: '#475569'  },
  info:     { border: '#3B82F6', icon: Info,           iconColor: '#3B82F6', statusBg: '#F1F5F9',    statusText: '#475569'  },
};

/** Live elapsed timer for active/responding alerts. */
function useElapsed(startedAt: number) {
  const [elapsed, setElapsed] = useState(Math.floor((Date.now() - startedAt) / 1000));
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

const ElapsedTimer: React.FC<{ startedAt: number }> = ({ startedAt }) => {
  const elapsed = useElapsed(startedAt);
  return <span className="text-[11px] font-mono tabular-nums text-[#94A3B8]">{elapsed}</span>;
};

type FeedTab = 'Feed' | 'Timeline';

export const CriticalAlertsWidget: React.FC = () => {
  const [tab, setTab] = useState<FeedTab>('Feed');
  const [alerts] = useState<Alert[]>(INITIAL_ALERTS);

  const activeAlerts = alerts.filter(a => a.status === 'Active' || a.status === 'Responding');
  const feedAlerts   = alerts.filter(a => a.status !== 'Responding' || a.severity !== 'critical');

  return (
    <div
      className="min-h-[320px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col overflow-hidden"
      role="region"
      aria-label="Critical Alerts & Emergency Queue"
    >
      {/* Fixed-height header */}
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#E2E8F0] shrink-0">
        <h3 className="text-[14px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
          Critical Alerts &amp; Emergency Queue
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" aria-hidden="true" />
        </h3>
        <button
          className="text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-0.5 group outline-none"
          aria-label="View all alerts"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Pinned Active Emergencies section */}
      {activeAlerts.length > 0 && (
        <div className="bg-[#FEF2F2] border-b border-[#FCA5A5]/40 px-5 py-3 flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-[#991B1B] uppercase tracking-[0.06em] mb-1">
            ▲ Active Emergencies ({activeAlerts.length})
          </div>
          {activeAlerts.map(alert => {
            const cfg = SEVERITY_CONFIG[alert.severity];
            const Icon = cfg.icon;
            return (
              <div key={alert.id} className="flex items-center gap-3">
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: cfg.iconColor }} strokeWidth={2.5} />
                <span className="text-[13px] font-medium text-[#0F172A] flex-1 truncate">{alert.title}</span>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] border shrink-0"
                  style={{ color: cfg.statusText, backgroundColor: cfg.statusBg, borderColor: cfg.border + '30' }}
                >
                  {alert.status}
                </span>
                <ElapsedTimer startedAt={alert.startedAt} />
              </div>
            );
          })}
        </div>
      )}

      {/* Feed | Timeline tab bar */}
      <div className="flex items-center border-b border-[#E2E8F0] px-5" role="tablist">
        {(['Feed', 'Timeline'] as FeedTab[]).map(t => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`h-[44px] px-1 mr-5 text-[13px] font-medium border-b-2 transition-colors ${
              tab === t
                ? 'text-[#0F172A] border-[#2563EB]'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Feed */}
      {tab === 'Feed' && (
        <div className="flex flex-col flex-1 overflow-y-auto">
          {feedAlerts.map(alert => {
            const cfg = SEVERITY_CONFIG[alert.severity];
            const Icon = cfg.icon;
            return (
              <div
                key={alert.id}
                className="group relative flex items-center justify-between gap-4 px-5 h-[72px] border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer last:border-b-0 focus-within:outline-none"
                tabIndex={0}
                role="button"
                aria-label={`${alert.severity} alert: ${alert.title}`}
              >
                <div className="absolute left-0 top-[12px] bottom-[12px] w-[2.5px] rounded-r-[2px]" style={{ backgroundColor: cfg.border }} />
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <Icon className="w-[16px] h-[16px] shrink-0" style={{ color: cfg.iconColor }} strokeWidth={2.5} />
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[#0F172A] truncate">{alert.title}</span>
                      <span className="text-[13px] text-[#94A3B8] truncate hidden xl:inline-block">{alert.location}</span>
                    </div>
                    <span className="text-[13px] text-[#64748B] truncate mt-0.5">{alert.description}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] border"
                    style={{ color: cfg.statusText, backgroundColor: cfg.statusBg, borderColor: '#E2E8F0' }}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline */}
      {tab === 'Timeline' && (
        <div className="flex-1 px-5 py-4 overflow-y-auto">
          <div className="flex flex-col gap-0">
            {alerts.map((alert, i) => {
              const cfg = SEVERITY_CONFIG[alert.severity];
              const date = new Date(alert.startedAt);
              const time = date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
              return (
                <div key={alert.id} className="relative flex gap-4 pb-5 last:pb-0">
                  {/* Vertical connector */}
                  {i < alerts.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-0 w-[1px] bg-[#E2E8F0]" />
                  )}
                  {/* Dot */}
                  <div className="shrink-0 w-[10px] h-[10px] rounded-full border-2 border-white mt-1 shadow-sm" style={{ backgroundColor: cfg.border }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="text-[13px] font-medium text-[#0F172A] truncate">{alert.title}</span>
                      <span className="text-[11px] font-mono text-[#94A3B8] shrink-0">{time}</span>
                    </div>
                    <span className="text-[12px] text-[#64748B]">{alert.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
