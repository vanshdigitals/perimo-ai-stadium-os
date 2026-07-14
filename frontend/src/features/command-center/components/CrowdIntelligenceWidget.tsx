import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Gate {
  gateId: string;
  occupancy: number;
  capacity: number;
  flowRate: number;
}

interface Props {
  gates: Gate[];
}

export const CrowdIntelligenceWidget: React.FC<Props> = ({ gates }) => {
  const [crowdTab, setCrowdTab] = useState<'Density' | 'Flow Rate'>('Density');

  return (
    <div className="min-h-[300px] xl:min-h-[340px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
          Crowd Intelligence
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
        </h3>
        <button className="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between bg-[#F1F5F9] p-1 rounded-[8px] mb-2">
        <button 
          onClick={() => setCrowdTab('Density')}
          className={`flex-1 h-7 text-[12px] font-medium rounded-[6px] transition-all ${crowdTab === 'Density' ? 'text-[#0F172A] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
        >
          Density
        </button>
        <button 
          onClick={() => setCrowdTab('Flow Rate')}
          className={`flex-1 h-7 text-[12px] font-medium rounded-[6px] transition-all ${crowdTab === 'Flow Rate' ? 'text-[#0F172A] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
        >
          Flow Rate
        </button>
      </div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
          <div className="w-2.5 h-2.5 bg-[#1652F0] rounded-[2px]" /> Selected / Highest
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#64748B]">
          <div className="w-2.5 h-2.5 bg-[#E2E5EA] rounded-[2px]" /> Nominal
        </div>
      </div>

      <div className="flex-1 flex gap-3 pb-2 relative">
        {/* Y-Axis Label */}
        <div className="flex flex-col justify-between text-[10px] font-mono text-[#9AA3B2] py-1 border-r border-[#E2E8F0] pr-2 shrink-0 w-[35px] text-right">
          <span>{crowdTab === 'Density' ? '100%' : '500'}</span>
          <span>{crowdTab === 'Density' ? '50%' : '250'}</span>
          <span>0</span>
        </div>
        
        <div className="flex-1 flex items-end gap-1.5 group/chart h-[150px]">
          {gates.map((gate) => {
            const density = Math.min(100, Math.round((gate.occupancy / gate.capacity) * 100));
            const flowRate = gate.flowRate;
            const value = crowdTab === 'Density' ? density : flowRate;
            const maxVal = crowdTab === 'Density' ? 100 : 500;
            const heightPct = Math.max(5, Math.min(100, (value / maxVal) * 100));
            
            const isHighlight = (crowdTab === 'Density' && density > 80) || (crowdTab === 'Flow Rate' && flowRate > 200);

            return (
              <div key={gate.gateId} className={`flex-1 ${isHighlight ? 'bg-[#1652F0]' : 'bg-[#E2E5EA] hover:bg-[#9AA3B2]'} transition-colors rounded-t-[4px] relative group/bar cursor-pointer`} style={{ height: `${heightPct}%` }}>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#141822] text-white text-[11px] px-2.5 py-1.5 rounded-[6px] opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-[0_4px_12px_rgba(10,14,20,0.15)] flex flex-col items-center">
                  <span className="font-semibold">{gate.gateId}</span>
                  <span className="font-mono text-[10px] text-[#9AA3B2]">{crowdTab === 'Density' ? `${density}%` : `${flowRate}/min`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
