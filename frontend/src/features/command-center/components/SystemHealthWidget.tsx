import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const SystemHealthWidget: React.FC = () => {
  const [isSystemHealthExpanded, setIsSystemHealthExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] flex flex-col p-4 transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => setIsSystemHealthExpanded(!isSystemHealthExpanded)}
      >
        <h3 className="text-[13px] font-semibold text-[#0F172A] m-0 flex items-center gap-2">
          System Health
          <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#1FAA6D] bg-[#1FAA6D]/10 px-2 py-0.5 rounded-[4px]">Platform: Nominal</span>
          <ChevronRight className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${isSystemHealthExpanded ? 'rotate-90' : ''}`} />
        </div>
      </div>
      
      {isSystemHealthExpanded && (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {/* Metric 1 */}
        <div className="flex flex-col justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-2.5 hover:border-[#CBD5E1] transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#64748B]">Server Uptime</span>
            <div className="flex items-end gap-[2px] h-2.5 group-hover:opacity-100 opacity-80 smooth-transition">
              <div className="w-1 h-[60%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="w-1 h-[80%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_200ms]" />
              <div className="w-1 h-[70%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_400ms]" />
              <div className="w-1 h-[100%] bg-[#1FAA6D] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_600ms]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1.5 tabular-nums">
            <span className="text-[15px] font-mono font-semibold text-[#0F172A] tracking-tight">99.99</span>
            <span className="text-[11px] font-medium text-[#64748B]">%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-2.5 hover:border-[#CBD5E1] transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#64748B]">API Latency</span>
            <div className="flex items-end gap-[2px] h-2.5 group-hover:opacity-100 opacity-80 smooth-transition">
              <div className="w-1 h-[40%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_100ms]" />
              <div className="w-1 h-[50%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_300ms]" />
              <div className="w-1 h-[30%] bg-[#CBD5E1] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_500ms]" />
              <div className="w-1 h-[60%] bg-[#1652F0] rounded-[1px] animate-[pulse_2s_ease-in-out_infinite_700ms]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-1.5 tabular-nums">
            <span className="text-[15px] font-mono font-semibold text-[#0F172A] tracking-tight">24</span>
            <span className="text-[11px] font-medium text-[#64748B]">ms</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-2.5 hover:border-[#CBD5E1] transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#64748B]">IoT Nodes</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D]" />
          </div>
          <div className="flex flex-col mt-1.5 tabular-nums">
            <span className="text-[15px] font-mono font-semibold text-[#0F172A] tracking-tight">14,204</span>
            <span className="text-[10px] font-medium text-[#1FAA6D] mt-0.5">99.2% Online</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex flex-col justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-2.5 hover:border-[#CBD5E1] transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#64748B]">Camera Feed</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D68A00]" />
          </div>
          <div className="flex flex-col mt-1.5 tabular-nums">
            <span className="text-[15px] font-mono font-semibold text-[#0F172A] tracking-tight">244<span className="text-[#94A3B8] text-[12px] font-medium ml-0.5">/245</span></span>
            <span className="text-[10px] font-medium text-[#D68A00] mt-0.5">1 Offline</span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
