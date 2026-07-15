import React from 'react'
import { FanLayout } from '@/components/layouts/FanLayout'

export const FanDashboard: React.FC = () => {
  return (
    <FanLayout>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">
          Welcome to the Match
        </h1>
        <p className="text-[#475569]">Your personalized stadium experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-white shadow-sm border border-[#E2E8F0] rounded-[12px] p-6">
          <h3 className="font-semibold text-lg text-[#0F172A] mb-4">Next Match</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-xl flex items-center justify-center font-bold text-[#0F172A]">
              HOME
            </div>
            <span className="font-semibold text-xl">vs</span>
            <div className="w-16 h-16 bg-[#F1F5F9] rounded-xl flex items-center justify-center font-bold text-[#0F172A]">
              AWAY
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-medium text-[#2563EB]">Kickoff in 1 hour 15 minutes</span>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-[#E2E8F0] rounded-[12px] p-6">
          <h3 className="font-semibold text-lg text-[#0F172A] mb-4">Your Gate</h3>
          <div className="text-3xl font-display font-bold text-[#0F172A] mb-2">Gate B</div>
          <p className="text-sm text-[#475569]">Wait time: 5 mins</p>
        </div>
      </div>
    </FanLayout>
  )
}
