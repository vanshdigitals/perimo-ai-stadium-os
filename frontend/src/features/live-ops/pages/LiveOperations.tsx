import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Activity, Clock, ShieldAlert, WifiHigh } from 'lucide-react'

export const LiveOperations: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Live Operations</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Real-time status and operational health of all venue sectors.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* TOP ROW: KPIs */}
        <div className="col-span-12 md:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><Activity className="w-4 h-4 text-[#2563EB]" /> Active Events</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">3</div>
        </div>
        <div className="col-span-12 md:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><WifiHigh className="w-4 h-4 text-[#16A34A]" /> Sensor Network</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">99.8%</div>
        </div>
        <div className="col-span-12 md:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><Clock className="w-4 h-4 text-[#F59E0B]" /> Avg Response Time</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">1m 45s</div>
        </div>
        <div className="col-span-12 md:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><ShieldAlert className="w-4 h-4 text-[#DC2626]" /> Escalations</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">0</div>
        </div>

        {/* MIDDLE ROW: Activity Stream and Sector Map */}
        <div className="col-span-12 xl:col-span-8 min-h-[500px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Live Sector Activity</h3>
          <div className="flex-1 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">Real-time sector mapping will render here</p>
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4 min-h-[500px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Operations Log</h3>
          <div className="flex-1 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-3 p-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-white rounded-md border border-[#E2E8F0] p-3 flex flex-col justify-center">
                <div className="w-3/4 h-2 bg-[#E2E8F0] rounded-full mb-2"></div>
                <div className="w-1/2 h-1.5 bg-[#F1F5F9] rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
