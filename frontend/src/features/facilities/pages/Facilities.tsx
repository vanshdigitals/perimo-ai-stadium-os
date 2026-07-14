import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Thermometer, Zap, Droplet } from 'lucide-react'

export const Facilities: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Facilities Management</h1>
          <p className="text-[14px] text-[#64748B] mt-1">HVAC, power grids, sanitation, and physical infrastructure health.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5">
            <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium mb-2"><Zap className="w-4 h-4 text-[#F59E0B]" /> Grid Load</div>
            <div className="text-[24px] font-semibold text-[#0F172A]">42.5 MW</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5">
            <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium mb-2"><Thermometer className="w-4 h-4 text-[#EF4444]" /> Avg Core Temp</div>
            <div className="text-[24px] font-semibold text-[#0F172A]">72°F</div>
          </div>
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5">
            <div className="flex items-center gap-2 text-[#64748B] text-[13px] font-medium mb-2"><Droplet className="w-4 h-4 text-[#3B82F6]" /> Sanitation Status</div>
            <div className="text-[14px] font-medium text-[#16A34A] pt-1">All systems nominal</div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 min-h-[500px] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 flex flex-col">
          <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Infrastructure Health Map</h3>
          <div className="flex-1 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center">
            <p className="text-[#94A3B8] text-[13px]">BIM (Building Information Modeling) layer will render here</p>
          </div>
        </div>

        <div className="col-span-12 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5">
           <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Maintenance Requests</h3>
           <div className="rounded-[10px] border border-[#E2E8F0] overflow-hidden">
             <table className="w-full text-left text-[13px]">
               <thead className="bg-[#F8FAFC] text-[#64748B] font-medium border-b border-[#E2E8F0]">
                 <tr>
                   <th className="px-4 py-3 font-medium">ID</th>
                   <th className="px-4 py-3 font-medium">Location</th>
                   <th className="px-4 py-3 font-medium">Issue</th>
                   <th className="px-4 py-3 font-medium">Priority</th>
                   <th className="px-4 py-3 font-medium">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-[#E2E8F0]">
                 {[1,2,3].map(i => (
                   <tr key={i} className="hover:bg-[#F8FAFC]">
                     <td className="px-4 py-3 text-[#64748B]">#REQ-00{i}</td>
                     <td className="px-4 py-3 text-[#0F172A]">Sector {i} Restrooms</td>
                     <td className="px-4 py-3 text-[#344055]">Plumbing maintenance required</td>
                     <td className="px-4 py-3">
                       <span className="bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full text-[11px] font-medium">Medium</span>
                     </td>
                     <td className="px-4 py-3 text-[#64748B]">Dispatched</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </AdminLayout>
  )
}
