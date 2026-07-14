import React from 'react';

interface Gate {
  gateId: string;
  occupancy: number;
  capacity: number;
  flowRate: number;
  securityStatus: string;
  waitLevel: string;
}

interface Props {
  gates: Gate[];
}

export const EntryGatesWidget: React.FC<Props> = ({ gates }) => {
  return (
    <div className="min-h-[300px] xl:min-h-[340px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 h-[60px] border-b border-[#E2E8F0] shrink-0">
        <h3 className="text-[14px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
          Entry Gates Throughput
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
        </h3>
        <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
        </button>
      </div>
      
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-medium text-[#64748B] uppercase tracking-wider">
          <span className="w-[80px]">Gate</span>
          <span className="flex-1">Flow Rate</span>
          <span className="w-[50px] text-right">Wait</span>
        </div>

        <div className="flex flex-col overflow-y-auto">
          {gates.length === 0 && (
            <div className="text-center text-[#64748B] text-[13px] py-4">Waiting for data...</div>
          )}
          {gates.map((gate) => {
            const isHeightened = gate.securityStatus === 'heightened';
            const isCritical = gate.securityStatus === 'critical';
            const statusColor = isCritical ? '#EA580C' : isHeightened ? '#F59E0B' : '#1FAA6D';
            const barWidth = Math.min(100, (gate.flowRate / 300) * 100);
            
            return (
              <div key={gate.gateId} className="group/row relative flex items-center justify-between px-5 h-[48px] border-b border-[#E2E8F0] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 bg-[#141822] text-white text-[11px] px-3 py-2 rounded-[6px] opacity-0 group-hover/row:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl whitespace-nowrap">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[12px]">{gate.gateId}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] font-mono bg-white/20">{gate.securityStatus.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#9AA3B2]">Occupancy: <span className="text-white tabular-nums font-mono">{gate.occupancy}</span> / {gate.capacity}</span>
                    <span className="text-[#9AA3B2]">Wait Level: <span className="text-white tabular-nums font-mono capitalize">{gate.waitLevel}</span></span>
                  </div>
                </div>
                
                <span className="w-[80px] text-[13px] font-medium text-[#0F172A] truncate">
                  {gate.gateId} 
                  {!isCritical && !isHeightened && <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#1FAA6D] ml-1 mb-0.5"/>}
                  {isHeightened && <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#F59E0B] ml-1 mb-0.5"/>}
                  {isCritical && <span className="w-1.5 h-1.5 inline-block rounded-full bg-[#EA580C] ml-1 mb-0.5 animate-perimo-pulse"/>}
                </span>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-[60%] h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${barWidth}%`, backgroundColor: statusColor }} />
                  </div>
                  <span className="text-[12px] font-mono tabular-nums text-[#64748B] w-[45px] text-right">{gate.flowRate}/m</span>
                </div>
                <span className="w-[50px] text-right text-[13px] font-mono tabular-nums font-semibold text-[#0F172A]">{gate.waitLevel === 'high' ? '12m' : gate.waitLevel === 'medium' ? '5m' : '1m'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
