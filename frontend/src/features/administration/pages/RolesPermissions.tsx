import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { ShieldCheck, Plus } from 'lucide-react'

export const RolesPermissions: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Roles & Permissions</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Configure RBAC rules and module access.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-[8px] text-[13px] font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" /> Custom Role
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {['Global Administrator', 'Security Operator', 'Facilities Manager', 'Guest Services', 'Executive Viewer'].map((role, idx) => (
            <div key={role} className={`p-4 border rounded-[12px] cursor-pointer ${idx === 0 ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold text-[14px] ${idx === 0 ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{role}</span>
                <ShieldCheck className={`w-4 h-4 ${idx === 0 ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`} />
              </div>
              <div className="text-[12px] text-[#64748B]">
                {idx === 0 ? 'Full access to all system components and configurations.' : 'Restricted access based on domain.'}
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] p-6 min-h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-6 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-[18px] font-semibold text-[#0F172A]">Global Administrator</h2>
              <p className="text-[13px] text-[#64748B]">12 users assigned</p>
            </div>
            <button className="text-[13px] text-[#2563EB] font-medium">Edit Configuration</button>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F8FAFC] text-[#64748B] font-medium border-y border-[#E2E8F0]">
                <tr>
                  <th className="px-4 py-3 font-medium">Module Name</th>
                  <th className="px-4 py-3 font-medium text-center">View</th>
                  <th className="px-4 py-3 font-medium text-center">Edit</th>
                  <th className="px-4 py-3 font-medium text-center">Delete</th>
                  <th className="px-4 py-3 font-medium text-center">Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {['Command Center', 'Digital Twin', 'AI Operations', 'User Management', 'Billing'].map(mod => (
                  <tr key={mod} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 text-[#0F172A] font-medium">{mod}</td>
                    <td className="px-4 py-3 text-center"><input type="checkbox" checked readOnly className="accent-[#2563EB]" /></td>
                    <td className="px-4 py-3 text-center"><input type="checkbox" checked readOnly className="accent-[#2563EB]" /></td>
                    <td className="px-4 py-3 text-center"><input type="checkbox" checked readOnly className="accent-[#2563EB]" /></td>
                    <td className="px-4 py-3 text-center"><input type="checkbox" checked readOnly className="accent-[#2563EB]" /></td>
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
