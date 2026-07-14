import React from 'react'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { DigitalTwinWidget } from '@/features/digital-twin/components/DigitalTwinWidget'

export const DigitalTwinOverview: React.FC = () => {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">Digital Twin</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Full-screen 3D immersive environment mapping.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-[8px] text-[13px] font-medium text-[#0F172A]">Layers</button>
            <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-[8px] text-[13px] font-medium text-[#0F172A]">Settings</button>
          </div>
        </div>
      </div>

      <div className="w-full min-h-[calc(100vh-200px)] bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
         {/* We reuse the DigitalTwinWidget but give it full screen context */}
         <DigitalTwinWidget />
      </div>
    </AdminLayout>
  )
}
