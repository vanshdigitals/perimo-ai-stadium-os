import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { MapPin, CheckCircle, Map as MapIcon, Route } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'

interface Checkpoint {
  id: string
  name: string
  status: 'Pending' | 'Completed'
  time?: string
}

export const StaffPatrol: React.FC = () => {
  const { toast } = useApp()
  const [isPatrolActive, setIsPatrolActive] = useState(false)
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([
    { id: '1', name: 'Gate C Entrance', status: 'Pending' },
    { id: '2', name: 'Sector 104 Concourse', status: 'Pending' },
    { id: '3', name: 'Restroom Block B', status: 'Pending' },
    { id: '4', name: 'VIP Lounge Exterior', status: 'Pending' },
  ])

  const togglePatrol = () => {
    setIsPatrolActive(!isPatrolActive)
    if (!isPatrolActive) {
      toast({ type: 'success', title: 'Patrol Started', message: 'Location sharing active. Route logged.' })
    } else {
      toast({ type: 'info', title: 'Patrol Ended', message: 'Patrol route saved to daily log.' })
    }
  }

  const markCheckpoint = (id: string) => {
    if (!isPatrolActive) {
      toast({ type: 'error', title: 'Cannot Check In', message: 'You must start the patrol first.' })
      return
    }
    setCheckpoints(prev => prev.map(c => c.id === id ? { ...c, status: 'Completed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : c))
    toast({ type: 'success', title: 'Checkpoint Reached', message: 'Location verified.' })
  }

  const completedCount = checkpoints.filter(c => c.status === 'Completed').length
  const progress = (completedCount / checkpoints.length) * 100

  return (
    <StaffLayout>
      <PageHeader title="Patrol Mode" subtitle="Execute patrol routes and log checkpoints." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Map View */}
        <div className="col-span-1 lg:col-span-8 flex flex-col h-full min-h-[500px]">
          <WidgetCard title="Live Patrol Map" icon={MapIcon} iconColor="#2563EB" className="flex-1 flex flex-col">
            <div className="relative flex-1 w-full bg-[#E2E8F0] rounded-xl overflow-hidden border border-[#CBD5E1]">
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2836&auto=format&fit=crop')] bg-cover bg-center grayscale" />
              
              {/* Fake Route SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path d="M 100 100 Q 200 150 300 100 T 500 200" fill="none" stroke="#2563EB" strokeWidth="4" strokeDasharray="8 8" className={cn(isPatrolActive ? "animate-[dash_2s_linear_infinite]" : "")} />
              </svg>

              {/* Fake Current Location */}
              <div className="absolute top-[100px] left-[100px] w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-10">
                {isPatrolActive && <div className="absolute inset-0 w-full h-full bg-blue-500 rounded-full animate-ping opacity-75" />}
              </div>

              {/* Overlays */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur border border-[#E2E8F0] p-4 rounded-xl shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-[#0F172A] mb-0.5">Route Alpha</div>
                  <div className="text-[12px] text-[#64748B]">Est. Time: 15 mins • Distance: 1.2km</div>
                </div>
                <button onClick={togglePatrol} className={cn("h-10 px-6 rounded-[8px] font-bold text-[13px] text-white transition-colors shadow-sm", isPatrolActive ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-[#2563EB] hover:bg-[#1D4ED8]")}>
                  {isPatrolActive ? 'End Patrol' : 'Start Patrol'}
                </button>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Checkpoints */}
        <div className="col-span-1 lg:col-span-4">
          <WidgetCard title="Checkpoints" icon={Route} iconColor="#475569">
            
            <div className="mb-6">
              <div className="flex justify-between text-[12px] font-bold mb-2">
                <span className="text-[#64748B]">Progress</span>
                <span className="text-[#0F172A]">{completedCount} / {checkpoints.length}</span>
              </div>
              <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="flex flex-col relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-[#E2E8F0]">
              {checkpoints.map((cp, idx) => (
                <div key={cp.id} className="relative flex items-start gap-4 py-3">
                  <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 bg-white z-10 transition-colors", 
                    cp.status === 'Completed' ? "border-[#10B981] text-[#10B981]" : "border-[#CBD5E1] text-[#94A3B8]"
                  )}>
                    {cp.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> : <span className="text-[12px] font-bold">{idx + 1}</span>}
                  </div>
                  
                  <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <div className={cn("text-[13px] font-bold", cp.status === 'Completed' ? "text-[#475569] line-through" : "text-[#0F172A]")}>{cp.name}</div>
                      {cp.time && <div className="text-[11px] font-medium text-[#10B981] mt-0.5">Reached at {cp.time}</div>}
                    </div>
                    {cp.status === 'Pending' && (
                      <button onClick={() => markCheckpoint(cp.id)} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] flex items-center justify-center hover:text-[#2563EB] hover:border-[#2563EB] transition-colors" title="Check In">
                        <MapPin className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </WidgetCard>
        </div>

      </div>
    </StaffLayout>
  )
}
