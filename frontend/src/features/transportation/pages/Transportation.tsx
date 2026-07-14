import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Bus, Car, TrainFront, Navigation } from 'lucide-react'

export const Transportation: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Transportation</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Monitor inbound/outbound transit, parking capacity, and VIP routing.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><Car className="w-4 h-4 text-[#3B82F6]" /> General Parking</div>
          <div className="flex items-end gap-2">
            <div className="text-[28px] font-semibold text-[#0F172A]">84%</div>
            <div className="text-[14px] text-[#64748B] pb-1">full</div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><Bus className="w-4 h-4 text-[#10B981]" /> Shuttle Arrivals</div>
          <div className="flex items-end gap-2">
            <div className="text-[28px] font-semibold text-[#0F172A]">12</div>
            <div className="text-[14px] text-[#64748B] pb-1">in next 15m</div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><TrainFront className="w-4 h-4 text-[#8B5CF6]" /> Rail Station Status</div>
          <div className="text-[16px] font-semibold text-[#16A34A] pt-2">Normal Operations</div>
        </div>
        <div className="col-span-12 lg:col-span-3 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><Navigation className="w-4 h-4 text-[#F59E0B]" /> VIP Escorts</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">3 <span className="text-[14px] font-normal text-[#94A3B8]">en route</span></div>
        </div>

        <div className="col-span-12 xl:col-span-6 min-h-[400px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Live Traffic & Routing Map</h3>
          <div className="flex-1 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">Geospatial transit layer</p>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-6 flex flex-col gap-5">
          <div className="flex-1 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Parking Lot Capacities</h3>
            <div className="flex-1 flex flex-col gap-4">
              {['Lot A (North)', 'Lot B (South)', 'VIP Premium', 'Staff Parking'].map((lot, idx) => (
                <div key={lot}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="font-medium text-[#344055]">{lot}</span>
                    <span className="text-[#64748B]">{95 - (idx * 15)}%</span>
                  </div>
                  <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                    <div className="bg-[#3B82F6] h-2 rounded-full" style={{ width: `${95 - (idx * 15)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
