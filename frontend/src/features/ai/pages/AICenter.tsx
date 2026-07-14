import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { BrainCircuit, Sparkles, Network } from 'lucide-react'

export const AICenter: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">AI Center</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Orchestration, prompt tuning, and model health for PERIMO AI Copilot.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col min-h-[200px] justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#8B5CF6]" /> Gemini Pro 1.5</h3>
                <div className="text-[12px] text-[#64748B] mt-1">Primary inference engine</div>
              </div>
              <span className="bg-[#DCFCE7] text-[#16A34A] text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">Online</span>
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-[#64748B] mb-1">
                <span>API Quota</span>
                <span>42% used</span>
              </div>
              <div className="w-full bg-[#F1F5F9] rounded-full h-1.5">
                <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col min-h-[300px]">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2 mb-4"><Network className="w-4 h-4 text-[#3B82F6]" /> Active Context Vectors</h3>
            <div className="flex-1 flex flex-col gap-2">
              {['Live Occupancy', 'Camera Feeds', 'Weather Data', 'Historical Normals'].map(vector => (
                <div key={vector} className="flex items-center justify-between text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 rounded-[8px]">
                  <span className="text-[#344055] font-medium">{vector}</span>
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col min-h-[520px]">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2 mb-4"><BrainCircuit className="w-4 h-4 text-[#475569]" /> AI Interaction Log</h3>
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-4 flex flex-col gap-4 overflow-hidden">
               <div className="text-[12px] text-[#64748B] font-mono text-center mb-2">System analyzing venue telemetry...</div>
               
               <div className="flex flex-col gap-1 max-w-[80%]">
                 <div className="bg-white border border-[#E2E8F0] p-3 rounded-2xl rounded-tl-sm text-[13px] text-[#0F172A] shadow-sm">
                   Anomaly detected: Gate 4 flow rate is exceeding capacity by 15%. Recommend opening overflow lanes immediately.
                 </div>
                 <div className="text-[11px] text-[#94A3B8] ml-2">Gemini Pro • 2m ago</div>
               </div>
               
               <div className="flex flex-col gap-1 max-w-[80%] self-end items-end">
                 <div className="bg-[#2563EB] text-white p-3 rounded-2xl rounded-tr-sm text-[13px] shadow-sm">
                   Automated Action: Overflow lanes opened. Security staff notified.
                 </div>
                 <div className="text-[11px] text-[#94A3B8] mr-2">System • 1m ago</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
