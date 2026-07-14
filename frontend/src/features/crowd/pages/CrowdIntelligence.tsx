import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { UsersRound, TrendingUp, MapPin } from 'lucide-react'
import { CrowdIntelligenceWidget } from '@/features/command-center/components/CrowdIntelligenceWidget'
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates'

export const CrowdIntelligence: React.FC = () => {
  const { gates } = useLiveUpdates()
  
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Crowd Intelligence</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Predictive analysis, flow rates, and density mapping across the venue.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* KPI Row */}
        <div className="col-span-12 lg:col-span-4 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><UsersRound className="w-4 h-4 text-[#8B5CF6]" /> Total Occupancy</span>
            <span className="text-xs font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">+4.2%</span>
          </div>
          <div className="text-[28px] font-semibold text-[#0F172A]">42,105</div>
        </div>
        <div className="col-span-12 lg:col-span-4 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><TrendingUp className="w-4 h-4 text-[#F59E0B]" /> Projected Peak</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">54,000 <span className="text-[14px] font-normal text-[#94A3B8]">at 19:30</span></div>
        </div>
        <div className="col-span-12 lg:col-span-4 min-h-[120px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium"><MapPin className="w-4 h-4 text-[#EF4444]" /> High Density Zones</div>
          <div className="text-[28px] font-semibold text-[#0F172A]">Sector A, Gate 4</div>
        </div>

        {/* Reusing existing widget as a component */}
        <div className="col-span-12 xl:col-span-6">
          <CrowdIntelligenceWidget gates={gates} />
        </div>

        {/* Heatmap Placeholder */}
        <div className="col-span-12 xl:col-span-6 min-h-[340px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Historical Density Heatmap</h3>
          <div className="flex-1 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center p-6 text-center">
            <p className="text-[#94A3B8] text-[13px] max-w-[200px]">Historical 24-hour heatmap visualization will render here.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
