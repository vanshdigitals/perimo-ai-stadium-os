import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { BellRing, CheckCircle2 } from 'lucide-react'

export const Notifications: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Notifications</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Review system alerts, broadcast messages, and notifications.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-[8px] text-[13px] font-medium flex items-center gap-2 hover:bg-[#F8FAFC]">
            <CheckCircle2 className="w-4 h-4" /> Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col min-h-[600px]">
        <div className="flex items-center gap-4 px-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <button className="h-[48px] px-2 text-[13px] font-medium text-[#2563EB] border-b-2 border-[#2563EB]">All Alerts</button>
          <button className="h-[48px] px-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] border-b-2 border-transparent">System (4)</button>
          <button className="h-[48px] px-2 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] border-b-2 border-transparent">Security (1)</button>
        </div>

        <div className="flex-1 overflow-auto divide-y divide-[#E2E8F0]">
          {[1, 2, 3, 4, 5].map((item, idx) => (
            <div key={item} className={`p-5 flex gap-4 ${idx < 2 ? 'bg-[#F0FDF4]' : 'bg-white hover:bg-[#F8FAFC]'}`}>
              <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${idx < 2 ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                <BellRing className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-[14px] ${idx < 2 ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#344055]'}`}>
                    {idx === 0 ? 'AI Anomaly Detected: Unusually high flow at Gate 4' : 'Weekly Maintenance Report Available'}
                  </h4>
                  <span className="text-[12px] text-[#94A3B8] whitespace-nowrap">2m ago</span>
                </div>
                <p className="text-[13px] text-[#64748B]">
                  {idx === 0 ? 'Automated threshold was triggered. We recommend reviewing the CCTV feed for Sector A to confirm.' : 'The automated weekly maintenance report for all facilities has been generated.'}
                </p>
                {idx === 0 && (
                  <div className="mt-3 flex gap-2">
                    <button className="text-[12px] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md font-medium text-[#0F172A]">View Incident</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
