import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { LineChart, BarChart2, PieChart } from 'lucide-react'

export const Analytics: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Analytics</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Deep operational insights and historical trend analysis.</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-[36px] rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] px-3 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Event Day Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-6 min-h-[350px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-semibold text-[#0F172A] flex items-center gap-2"><LineChart className="w-5 h-5 text-[#2563EB]" /> Revenue vs Occupancy Correlation</h3>
          </div>
          <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">Main Area Chart Placeholder</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-6 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><BarChart2 className="w-4 h-4 text-[#8B5CF6]" /> Gate Performance</h3>
          </div>
          <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">Bar Chart Placeholder</p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-6 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-6 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-semibold text-[#0F172A] flex items-center gap-2"><PieChart className="w-4 h-4 text-[#F59E0B]" /> Incident Distribution</h3>
          </div>
          <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">Donut Chart Placeholder</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
