import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { UserPlus, Filter, MoreHorizontal } from 'lucide-react'

export const UserManagement: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">User Management</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage system access, active users, and staff accounts.</p>
          </div>
          <button className="px-4 py-2 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-[300px] h-[36px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <button className="flex items-center gap-2 text-[13px] text-[#64748B] bg-white px-3 py-1.5 border border-[#E2E8F0] rounded-[8px]">
            <Filter className="w-3.5 h-3.5" /> Filter by Role
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-white text-[#64748B] font-medium border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 font-medium">User Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Active</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <tr key={i} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[#64748B] font-medium">
                        U{i}
                      </div>
                      <div>
                        <div className="text-[#0F172A] font-medium">User {i} Placeholder</div>
                        <div className="text-[#64748B] text-[12px]">user{i}@perimo.io</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded-md text-[11px] font-medium">
                      {i === 1 ? 'Global Admin' : i === 2 ? 'Security Chief' : 'Staff Operator'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#64748B]">2 hours ago</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#64748B] hover:text-[#0F172A]"><MoreHorizontal className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-[13px] text-[#64748B] bg-[#F8FAFC]">
          <span>Showing 1 to 7 of 42 users</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border border-[#E2E8F0] rounded bg-white">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
