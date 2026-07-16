import React from 'react';
import { Truck, Expand, MoreVertical } from 'lucide-react';
import type { MobileUnit } from '@/features/digital-twin/types';
import { WidgetCard, WidgetHeaderButton } from '@/components/widgets/WidgetCard';

interface Props {
  units: MobileUnit[];
}

type UnitType = 'security' | 'medical' | 'police' | 'maintenance';

const UNIT_CONFIG: Record<UnitType, { label: string; color: string; bgColor: string }> = {
  security:    { label: 'Security',    color: '#1FAA6D', bgColor: '#1FAA6D1a' },
  medical:     { label: 'Medical',     color: '#C4291C', bgColor: '#C4291C1a' },
  police:      { label: 'Police',      color: '#1E3A8A', bgColor: '#1E3A8A1a' },
  maintenance: { label: 'Maintenance', color: '#D68A00', bgColor: '#D68A001a' },
};

const STATUS_DOT = {
  active:  'bg-[#1FAA6D] animate-perimo-pulse',
  busy:    'bg-[#D68A00] animate-perimo-pulse',
  offline: 'bg-[#94A3B8]',
} as const;

export const ResourceDeploymentWidget: React.FC<Props> = ({ units }) => {
  const grouped = (Object.keys(UNIT_CONFIG) as UnitType[]).map(type => {
    const ofType = units.filter(u => u.type === type);
    const active = ofType.filter(u => u.status === 'active').length;
    const busy   = ofType.filter(u => u.status === 'busy').length;
    const offline = ofType.filter(u => u.status === 'offline').length;
    return { type, ...UNIT_CONFIG[type], active, busy, offline, total: ofType.length };
  });

  return (
    <WidgetCard
      title="Resource Deployment"
      icon={Truck}
      live={true}
      actions={
        <>
          <WidgetHeaderButton icon={Expand} label="Expand" onClick={() => {}} />
          <WidgetHeaderButton icon={MoreVertical} label="Menu" onClick={() => {}} />
        </>
      }
      noPadding
      className="h-full"
      bodyClassName="flex flex-col"
    >
      {/* Unit rows */}
      <div className="flex-1 flex flex-col divide-y divide-[#E2E8F0] px-4 py-3 gap-1 overflow-y-auto">
        {grouped.map(row => (
          <div key={row.type} className="flex items-center justify-between py-3">
            {/* Unit type badge */}
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-7 h-7 rounded-[6px] shrink-0 flex items-center justify-center"
                style={{ backgroundColor: row.bgColor }}
              >
                <span
                  className="text-[10px] font-bold uppercase"
                  style={{ color: row.color }}
                >
                  {row.label[0]}
                </span>
              </div>
              <span className="text-[13px] font-medium text-[#0F172A] truncate">{row.label}</span>
            </div>

            {/* Status dots + count */}
            <div className="flex items-center gap-3 shrink-0">
              {row.active > 0 && (
                <StatusChip count={row.active} dotClass={STATUS_DOT.active} label="active" />
              )}
              {row.busy > 0 && (
                <StatusChip count={row.busy} dotClass={STATUS_DOT.busy} label="busy" />
              )}
              {row.offline > 0 && (
                <StatusChip count={row.offline} dotClass={STATUS_DOT.offline} label="idle" />
              )}
              {row.total === 0 && (
                <span className="text-[11px] text-[#94A3B8]">Not deployed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Totals footer */}
      <div className="border-t border-[#E2E8F0] px-5 py-3 flex items-center justify-between bg-[#F8FAFC] shrink-0">
        <span className="text-[11px] text-[#64748B]">Total units tracked</span>
        <span className="text-[12px] font-semibold font-mono tabular-nums text-[#0F172A]">{units.length}</span>
      </div>
    </WidgetCard>
  );
};

const StatusChip: React.FC<{ count: number; dotClass: string; label: string }> = ({ count, dotClass, label }) => (
  <div className="flex items-center gap-1.5" title={`${count} ${label}`}>
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} aria-hidden="true" />
    <span className="text-[12px] font-mono tabular-nums font-medium text-[#0F172A]">{count}</span>
    <span className="text-[11px] text-[#64748B] hidden xl:inline">{label}</span>
  </div>
);
