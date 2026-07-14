import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Globe, Shield, Database, Webhook } from 'lucide-react'

export const PlatformSettings: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div>
          <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Platform Settings</h1>
          <p className="text-[14px] text-[#64748B] mt-1">Global configurations for the PERIMO environment.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[240px] flex flex-col gap-1 shrink-0">
          <button className="w-full text-left px-4 py-2.5 rounded-[8px] bg-[#EFF6FF] text-[#1E40AF] font-medium text-[13px] flex items-center gap-2">
            <Globe className="w-4 h-4" /> General
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-[8px] hover:bg-[#F1F5F9] text-[#475569] font-medium text-[13px] flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security & MFA
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-[8px] hover:bg-[#F1F5F9] text-[#475569] font-medium text-[13px] flex items-center gap-2">
            <Database className="w-4 h-4" /> Data Retention
          </button>
          <button className="w-full text-left px-4 py-2.5 rounded-[8px] hover:bg-[#F1F5F9] text-[#475569] font-medium text-[13px] flex items-center gap-2">
            <Webhook className="w-4 h-4" /> Webhooks & Integrations
          </button>
        </div>

        <div className="flex-1 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-6 min-h-[600px]">
          <h2 className="text-[18px] font-semibold text-[#0F172A] mb-6 border-b border-[#E2E8F0] pb-4">General Settings</h2>
          
          <div className="flex flex-col gap-6 max-w-[600px]">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#344055]">Platform Name</label>
              <input type="text" defaultValue="PERIMO AI Operating System" className="h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]" />
              <p className="text-[12px] text-[#94A3B8]">The name displayed on the login screen and emails.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-semibold text-[#344055]">Timezone</label>
              <select className="h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]">
                <option>UTC (Coordinated Universal Time)</option>
                <option>America/New_York (EST)</option>
                <option>America/Los_Angeles (PST)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-[10px] mt-2">
              <div>
                <div className="text-[14px] font-semibold text-[#0F172A]">Maintenance Mode</div>
                <div className="text-[12px] text-[#64748B] mt-0.5">Disable all non-admin access to the platform.</div>
              </div>
              <div className="w-10 h-6 bg-[#E2E8F0] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
              <button className="px-5 py-2 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
