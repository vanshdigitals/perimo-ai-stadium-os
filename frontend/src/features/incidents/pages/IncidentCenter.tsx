import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { AlertTriangle, Filter, CheckCircle2, Siren } from 'lucide-react'

export const IncidentCenter: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Incident Center</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage, triage, and resolve venue incidents.</p>
          </div>
          <button className="px-4 py-2 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Report Incident
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="text-[14px] font-semibold text-[#0F172A]">Incident Queue</h3>
              <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white px-3 py-1.5 border border-[#E2E8F0] rounded-md"><Filter className="w-3.5 h-3.5" /> Filter</button>
            </div>
            
            {/* Empty State / Skeleton List */}
            <div className="flex-1 p-5 flex flex-col gap-3">
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <div key={item} className={`p-4 border border-[#E2E8F0] rounded-[10px] flex items-center justify-between ${idx === 0 ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-white'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-[#FEE2E2]' : 'bg-[#F1F5F9]'}`}>
                      {idx === 0 ? <Siren className="w-5 h-5 text-[#DC2626]" /> : <CheckCircle2 className="w-5 h-5 text-[#94A3B8]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`h-4 rounded-full ${idx === 0 ? 'w-48 bg-[#FCA5A5]' : 'w-64 bg-[#E2E8F0]'}`}></div>
                        {idx === 0 && <span className="bg-[#DC2626] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Critical</span>}
                      </div>
                      <div className="h-3 w-32 bg-[#F1F5F9] rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-3 w-16 bg-[#F1F5F9] rounded-full mb-2 ml-auto"></div>
                    <div className="h-3 w-24 bg-[#F1F5F9] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 min-h-[300px] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Response Teams</h3>
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center">
              <p className="text-[#94A3B8] text-[13px]">Available units and locations</p>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-5 min-h-[280px] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-4">Incident Geography</h3>
            <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex items-center justify-center">
              <p className="text-[#94A3B8] text-[13px]">Mini-map placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
