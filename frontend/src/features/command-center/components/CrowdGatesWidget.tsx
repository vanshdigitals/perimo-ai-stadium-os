import React, { useState } from 'react';
import { Users, Expand, MoreVertical } from 'lucide-react';
import type { GateThroughput } from '@/features/digital-twin/types';
import { WidgetCard, WidgetHeaderButton } from '@/components/widgets/WidgetCard';

type ViewMode = 'Density' | 'Flow Rate' | 'Table';

interface Props {
  gates: GateThroughput[];
}

export const CrowdGatesWidget: React.FC<Props> = ({ gates }) => {
  const [view, setView] = useState<ViewMode>('Density');

  return (
    <WidgetCard
      title="Crowd & Gates Intelligence"
      icon={Users}
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
      {/* Tab Toggle */}
      <div className="flex items-center bg-[#F1F5F9] m-4 mb-0 p-1 rounded-[8px] shrink-0" role="tablist">
        {(['Density', 'Flow Rate', 'Table'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            role="tab"
            aria-selected={view === mode}
            onClick={() => setView(mode)}
            className={`flex-1 h-7 text-[12px] font-medium rounded-[6px] transition-all outline-none ${
              view === mode
                ? 'text-[#0F172A] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Chart Views */}
      {(view === 'Density' || view === 'Flow Rate') && (
        <div className="flex-1 flex flex-col p-4 pt-3 min-h-0">
          <div className="flex items-center gap-4 mb-3 shrink-0">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
              <div className="w-2.5 h-2.5 bg-[#1652F0] rounded-[2px]" />
              {view === 'Density' ? 'High Density (>80%)' : 'High Flow (>200/min)'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
              <div className="w-2.5 h-2.5 bg-[#E2E5EA] rounded-[2px]" />
              Nominal
            </div>
          </div>

          <div className="flex-1 flex gap-3 pb-1 relative min-h-[140px]">
            {/* Y-Axis */}
            <div className="flex flex-col justify-between text-[10px] font-mono text-[#9AA3B2] py-1 border-r border-[#E2E8F0] pr-2 shrink-0 w-[35px] text-right">
              <span>{view === 'Density' ? '100%' : '500'}</span>
              <span>{view === 'Density' ? '50%' : '250'}</span>
              <span>0</span>
            </div>

            {/* Bars */}
            <div className="flex-1 flex items-end gap-1.5 group/chart h-full">
              {gates.map(gate => {
                const density = Math.min(100, Math.round((gate.occupancy / gate.capacity) * 100));
                const value = view === 'Density' ? density : gate.flowRate;
                const maxVal = view === 'Density' ? 100 : 500;
                const heightPct = Math.max(5, Math.min(100, (value / maxVal) * 100));
                const isHighlight =
                  (view === 'Density' && density > 80) ||
                  (view === 'Flow Rate' && gate.flowRate > 200);

                return (
                  <div
                    key={gate.gateId}
                    className={`flex-1 ${isHighlight ? 'bg-[#1652F0]' : 'bg-[#E2E5EA] hover:bg-[#9AA3B2]'} transition-colors rounded-t-[4px] relative group/bar cursor-pointer`}
                    style={{ height: `${heightPct}%` }}
                    title={`${gate.gateId}: ${view === 'Density' ? `${density}%` : `${gate.flowRate}/min`}`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#141822] text-white text-[11px] px-2.5 py-1.5 rounded-[6px] opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-[0_4px_12px_rgba(10,14,20,0.15)] flex flex-col items-center">
                      <span className="font-semibold">{gate.gateId}</span>
                      <span className="font-mono text-[10px] text-[#9AA3B2]">
                        {view === 'Density' ? `${density}%` : `${gate.flowRate}/min`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Table View */}
      {view === 'Table' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] border-y border-[#E2E8F0] mt-4 text-[11px] font-medium text-[#64748B] uppercase tracking-wider shrink-0">
            <span className="w-[80px]">Gate</span>
            <span className="flex-1">Flow Rate</span>
            <span className="w-[50px] text-right">Wait</span>
          </div>
          <div className="flex flex-col overflow-y-auto">
            {gates.length === 0 && (
              <div className="text-center text-[#64748B] text-[13px] py-4">Waiting for data…</div>
            )}
            {gates.map(gate => {
              const isCritical = gate.securityStatus === 'critical';
              const isHeightened = gate.securityStatus === 'heightened';
              const statusColor = isCritical ? '#C4291C' : isHeightened ? '#D68A00' : '#1FAA6D';
              const barWidth = Math.min(100, (gate.flowRate / 300) * 100);

              return (
                <div
                  key={gate.gateId}
                  className="group/row relative flex items-center justify-between px-4 h-[48px] shrink-0 border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                >
                  <span className="w-[80px] text-[13px] font-medium text-[#0F172A] truncate flex items-center gap-1.5">
                    {gate.gateId}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'animate-perimo-pulse' : ''}`}
                      style={{ backgroundColor: statusColor }}
                      aria-hidden="true"
                    />
                  </span>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-[60%] h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${barWidth}%`, backgroundColor: statusColor }}
                      />
                    </div>
                    <span className="text-[12px] font-mono tabular-nums text-[#64748B] w-[45px] text-right">
                      {gate.flowRate}/m
                    </span>
                  </div>
                  <span className="w-[50px] text-right text-[13px] font-mono tabular-nums font-semibold text-[#0F172A]">
                    {gate.waitLevel === 'high' ? '12m' : gate.waitLevel === 'medium' ? '5m' : '1m'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </WidgetCard>
  );
};
