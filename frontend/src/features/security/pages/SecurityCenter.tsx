import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Cctv, ScanFace, LockKeyhole } from 'lucide-react'

export const SecurityCenter: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Security Center</h1>
          <p className="text-[14px] text-[#64748B] mt-1">CCTV feeds, facial recognition, access control, and threat detection.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><Cctv className="w-4 h-4 text-[#475569]" /> Live Camera Grid</h3>
              <div className="flex gap-2">
                <button className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-md">Sector A</button>
                <button className="text-[12px] text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-md">Sector B</button>
                <button className="text-[12px] text-white bg-[#0F172A] px-3 py-1 rounded-md">VIP Areas</button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="bg-[#0F172A] rounded-[8px] overflow-hidden relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[#334155] text-[12px] font-mono">FEED_00{i}_OFFLINE</span>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-white/70 text-[10px] font-mono">CAM-{i}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 min-h-[240px] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2 mb-4"><ScanFace className="w-4 h-4 text-[#8B5CF6]" /> Biometric Matches</h3>
            <div className="flex-1 flex flex-col gap-3">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[8px] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#0F172A]">Banned Individual Detected</div>
                  <div className="text-[11px] text-[#64748B]">Gate 4 · 98% Match</div>
                </div>
                <button className="text-[11px] bg-[#FEF2F2] text-[#DC2626] font-medium px-2 py-1 rounded-md border border-[#FECACA]">Review</button>
              </div>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-[8px] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#0F172A]">VIP Arrival</div>
                  <div className="text-[11px] text-[#64748B]">Premium Entrance · 100% Match</div>
                </div>
                <button className="text-[11px] bg-[#F1F5F9] text-[#475569] font-medium px-2 py-1 rounded-md border border-[#E2E8F0]">Log</button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 min-h-[240px] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2 mb-4"><LockKeyhole className="w-4 h-4 text-[#3B82F6]" /> Access Control</h3>
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
               <div className="text-[32px] font-semibold text-[#16A34A]">100%</div>
               <div className="text-[12px] text-[#64748B] mt-1">All secure zones locked</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
