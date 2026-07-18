import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface KPICardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: React.ElementType;
  iconColor?: string;
  delta?: { value: string; direction: 'up' | 'down' | 'flat'; positive?: boolean };
  sparkline?: number[];
  sparklineColor?: string;
}

/** Compact KPI tile — the atomic unit of every module's top KPI row. */
export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  iconColor = '#2563EB',
  delta,
  sparkline,
  sparklineColor = '#2563EB',
}) => {
  const deltaColor = delta
    ? delta.direction === 'flat'
      ? 'text-[#64748B]'
      : delta.positive
      ? 'text-[#1FAA6D]'
      : 'text-[#C4291C]'
    : '';

  return (
    <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-4 flex flex-col justify-between h-full min-h-[104px]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-[#64748B]">{label}</span>
        {Icon && (
          <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0" style={{ backgroundColor: `${iconColor}1a` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} strokeWidth={2} />
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 mt-2">
        <div className="flex items-baseline gap-1 tabular-nums">
          <span className="text-[22px] font-semibold text-[#0F172A] font-mono tracking-tight">{value}</span>
          {unit && <span className="text-[12px] font-medium text-[#94A3B8]">{unit}</span>}
        </div>
        {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} color={sparklineColor} />}
      </div>

      {delta && (
        <div className={cn('flex items-center gap-1 mt-1.5 text-[11px] font-medium', deltaColor)}>
          {delta.direction === 'up' && <ArrowUp className="w-3 h-3" strokeWidth={2.5} />}
          {delta.direction === 'down' && <ArrowDown className="w-3 h-3" strokeWidth={2.5} />}
          {delta.value}
        </div>
      )}
    </div>
  );
};

const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 64;
  const h = 24;
  const padX = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const coords = data.map((v, i) => ({
    x: data.length === 1 ? w / 2 : padX + (i / (data.length - 1)) * (w - padX * 2),
    y: h - ((v - min) / range) * (h - 4) - 2,
  }));
  const points = coords.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const last = coords[coords.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 overflow-visible" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />
      {last && <circle cx={last.x} cy={last.y} r="1.6" fill={color} />}
    </svg>
  );
};
