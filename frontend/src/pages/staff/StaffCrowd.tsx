import React from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { Users, AlertTriangle, ArrowUpRight, TrendingUp, TrendingDown, Map } from 'lucide-react'
import { cn } from '@/utils/cn'

export const StaffCrowd: React.FC = () => {
  const currentDensity = 85 // percentage
  
  const recommendations = [
    { action: 'Open overflow queue lines at Gate C', priority: 'High', type: 'crowd_control' },
    { action: 'Deploy additional medical staff to Sector 104', priority: 'Medium', type: 'deployment' },
    { action: 'Broadcast "Remain Seated" announcement', priority: 'Low', type: 'comms' },
  ]

  return (
    <StaffLayout>
      <PageHeader title="Crowd Monitoring" subtitle="Live density and congestion metrics for your assigned zone." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Main Heatmap */}
        <div className="col-span-1 lg:col-span-8">
          <WidgetCard title="Zone Heatmap" icon={Map} iconColor="#2563EB">
            <div className="relative w-full aspect-[16/9] bg-[#0F172A] rounded-xl overflow-hidden border border-[#E2E8F0]">
              {/* Fake Map Background */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2836&auto=format&fit=crop')] bg-cover bg-center" />
              
              {/* Heatmap Overlay (Mocked with gradients) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-red-500/40 mix-blend-screen" />
              <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-orange-500/40 blur-[40px] rounded-full" />
              <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-red-600/50 blur-[50px] rounded-full" />

              {/* Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-white/90 backdrop-blur text-[#0F172A] px-3 py-1.5 rounded-lg text-[13px] font-bold shadow-sm">
                  North Concourse (Assigned)
                </div>
                <div className="bg-red-500/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> High Congestion Detected
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Metrics & Actions */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
          
          {/* Density Metric */}
          <WidgetCard title="Live Congestion" icon={Users} iconColor="#475569">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={currentDensity > 80 ? '#DC2626' : currentDensity > 60 ? '#D97706' : '#16A34A'} 
                    strokeWidth="10" 
                    strokeDasharray={`${currentDensity * 2.83} 283`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[28px] font-bold text-[#0F172A] leading-none">{currentDensity}%</span>
                  <span className="text-[11px] font-medium text-[#64748B] uppercase">Capacity</span>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full px-6">
                <div className="flex-1 flex flex-col items-center p-3 bg-[#F8FAFC] rounded-lg">
                  <span className="text-[12px] text-[#64748B] mb-1">People Count</span>
                  <span className="text-[18px] font-bold text-[#0F172A]">4,250</span>
                  <span className="text-[10px] text-[#16A34A] flex items-center gap-1 mt-1"><TrendingDown className="w-3 h-3" /> 2%</span>
                </div>
                <div className="flex-1 flex flex-col items-center p-3 bg-[#F8FAFC] rounded-lg">
                  <span className="text-[12px] text-[#64748B] mb-1">Flow Rate</span>
                  <span className="text-[18px] font-bold text-[#0F172A]">120/m</span>
                  <span className="text-[10px] text-[#DC2626] flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3" /> 15%</span>
                </div>
              </div>
            </div>
          </WidgetCard>

          {/* AI Recommended Actions */}
          <WidgetCard title="Recommended Actions" icon={AlertTriangle} iconColor="#D97706">
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="p-3 bg-white border border-[#E2E8F0] rounded-xl flex items-start gap-3 hover:border-[#2563EB] hover:shadow-sm transition-all cursor-pointer group">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", 
                    rec.priority === 'High' ? "bg-red-500" :
                    rec.priority === 'Medium' ? "bg-orange-500" : "bg-blue-500"
                  )} />
                  <div className="flex-1 text-[13px] text-[#0F172A] font-medium leading-tight">
                    {rec.action}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2563EB] shrink-0" />
                </div>
              ))}
            </div>
          </WidgetCard>

        </div>
      </div>
    </StaffLayout>
  )
}
