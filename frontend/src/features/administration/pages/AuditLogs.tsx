import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { Download } from 'lucide-react'

export const AuditLogs: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Audit Logs</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Immutable ledger of all system actions, configurations, and AI decisions.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-[8px] text-[13px] font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col min-h-[600px]">
        <div className="p-5 border-b border-[#E2E8F0] flex items-center gap-4 bg-[#F8FAFC]">
          <div className="relative flex-1 max-w-[400px]">
            <input 
              type="text" 
              placeholder="Search by Event ID, User, or Action..." 
              className="w-full h-[36px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <select className="h-[36px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] text-[#0F172A] outline-none">
            <option>All Event Types</option>
            <option>Authentication</option>
            <option>AI Operations</option>
            <option>Configuration Change</option>
          </select>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-white text-[#64748B] font-medium border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp (UTC)</th>
                <th className="px-6 py-4 font-medium">Event ID</th>
                <th className="px-6 py-4 font-medium">Actor</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-mono text-[12px]">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <tr key={i} className="hover:bg-[#F8FAFC]">
                  <td className="px-6 py-3 text-[#64748B]">2026-07-13 14:0{i}:22</td>
                  <td className="px-6 py-3 text-[#3B82F6]">EVT-99{i}2A</td>
                  <td className="px-6 py-3 text-[#0F172A] font-sans">
                    {i === 2 ? 'PERIMO AI System' : 'john.doe@perimo.io'}
                  </td>
                  <td className="px-6 py-3">
                    <span className="bg-[#F1F5F9] text-[#475569] px-2 py-1 rounded">
                      {i === 2 ? 'AUTO_SCALE_GATES' : 'USER_LOGIN'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[#64748B]">Gate_Cluster_4</td>
                  <td className="px-6 py-3 text-[#94A3B8] max-w-[200px] truncate">
                    {i === 2 ? 'AI automatically opened overflow lane due to threshold.' : 'Successful MFA login.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
