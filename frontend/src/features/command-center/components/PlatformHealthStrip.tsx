import React from 'react';
import { Server, Cpu, Database, Activity, Map, Brain, HardDrive } from 'lucide-react';
import { cn } from '@/utils/cn';

const SERVICES = [
  { label: 'Platform', icon: Server, status: 'nominal' as const, latency: '12ms', sync: 'just now' },
  { label: 'API', icon: Cpu, status: 'nominal' as const, latency: '24ms', sync: 'just now' },
  { label: 'Database', icon: Database, status: 'nominal' as const, latency: '8ms', sync: '1s ago' },
  { label: 'WebSocket', icon: Activity, status: 'degraded' as const, latency: '145ms', sync: '2s ago' },
  { label: 'Maps', icon: Map, status: 'nominal' as const, latency: '42ms', sync: 'just now' },
  { label: 'AI', icon: Brain, status: 'nominal' as const, latency: '89ms', sync: 'just now' },
  { label: 'Storage', icon: HardDrive, status: 'nominal' as const, latency: '18ms', sync: 'just now' },
];

const STATUS_CONFIG = {
  nominal:  { dot: 'bg-[#1FAA6D]', border: 'border-[#1FAA6D]/20', bg: 'bg-[#1FAA6D]/5' },
  degraded: { dot: 'bg-[#D68A00]', border: 'border-[#D68A00]/20', bg: 'bg-[#D68A00]/5' },
  offline:  { dot: 'bg-[#C4291C]', border: 'border-[#C4291C]/20', bg: 'bg-[#C4291C]/5' },
};

export const PlatformHealthStrip: React.FC = () => {
  const hasIssue = SERVICES.some(s => s.status !== 'nominal');

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('w-2 h-2 rounded-full', hasIssue ? 'bg-[#D68A00]' : 'bg-[#1FAA6D] animate-perimo-pulse')} />
          <h3 className="text-[14px] font-semibold text-[#0F172A] m-0">System Status</h3>
        </div>
        <span className="text-[11px] font-mono text-[#94A3B8] tabular-nums">
          {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {SERVICES.map((svc) => {
          const cfg = STATUS_CONFIG[svc.status];
          const Icon = svc.icon;
          return (
            <div key={svc.label} className={cn("flex flex-col gap-1.5 p-2.5 rounded-[8px] border transition-colors", cfg.border, cfg.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#334155]">
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                  <span className="text-[12px] font-semibold">{svc.label}</span>
                </div>
                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                <span>{svc.latency}</span>
                <span>{svc.sync}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
