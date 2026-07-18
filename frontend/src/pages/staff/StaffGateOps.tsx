import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { DoorOpen, Users, Lock, Unlock, AlertTriangle, Search, Activity } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'

interface Gate {
  id: string
  name: string
  status: 'Open' | 'Closed' | 'Lockdown'
  capacity: number
  currentQueue: number
  scannerStatus: 'Online' | 'Offline'
}

const MOCK_GATES: Gate[] = [
  { id: 'G-01', name: 'North Main Gate', status: 'Open', capacity: 5000, currentQueue: 120, scannerStatus: 'Online' },
  { id: 'G-02', name: 'VIP East', status: 'Open', capacity: 1000, currentQueue: 15, scannerStatus: 'Online' },
  { id: 'G-03', name: 'South Transit', status: 'Closed', capacity: 4000, currentQueue: 0, scannerStatus: 'Offline' },
  { id: 'G-04', name: 'Media Entrance', status: 'Lockdown', capacity: 500, currentQueue: 45, scannerStatus: 'Online' },
]

export const StaffGateOps: React.FC = () => {
  const { toast } = useApp()
  const [gates, setGates] = useState<Gate[]>(MOCK_GATES)
  const [search, setSearch] = useState('')

  const handleGateAction = (id: string, action: 'Open' | 'Closed' | 'Lockdown') => {
    setGates(prev => prev.map(g => g.id === id ? { ...g, status: action } : g))
    if (action === 'Lockdown') {
      toast({ type: 'error', title: 'EMERGENCY LOCKDOWN', message: `Gate ${id} has been locked down.` })
    } else {
      toast({ type: 'success', title: 'Gate Updated', message: `Gate ${id} is now ${action}.` })
    }
  }

  const filtered = gates.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <StaffLayout>
      <PageHeader title="Gate Operations" subtitle="Control and monitor stadium access points." />

      <WidgetCard title="Access Control" icon={DoorOpen} iconColor="#2563EB">
        
        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search gates..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-[8px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filtered.map(gate => (
            <div key={gate.id} className={cn("p-5 rounded-xl border flex flex-col gap-5 transition-all", 
              gate.status === 'Lockdown' ? "border-red-300 bg-red-50/50" : 
              gate.status === 'Closed' ? "border-[#E2E8F0] bg-[#F8FAFC]" : "border-[#E2E8F0] bg-white")}>
              
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-bold text-[#64748B]">{gate.id}</span>
                    <span className={cn("px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase", 
                      gate.status === 'Open' ? "bg-emerald-100 text-emerald-700" :
                      gate.status === 'Closed' ? "bg-slate-200 text-slate-700" :
                      "bg-red-100 text-red-700 animate-pulse"
                    )}>{gate.status}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#0F172A]">{gate.name}</h3>
                </div>
                
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white border border-[#E2E8F0]">
                  <Activity className={cn("w-3.5 h-3.5", gate.scannerStatus === 'Online' ? "text-[#16A34A]" : "text-[#94A3B8]")} />
                  <span className="text-[11px] font-semibold text-[#475569]">Scanners {gate.scannerStatus}</span>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                    <Users className="w-3.5 h-3.5" /> Live Queue
                  </div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{gate.currentQueue} <span className="text-[12px] font-medium text-[#64748B]">people</span></div>
                </div>
                <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] uppercase mb-1">
                    <DoorOpen className="w-3.5 h-3.5" /> Capacity limit
                  </div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{gate.capacity.toLocaleString()}</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => handleGateAction(gate.id, 'Open')}
                  disabled={gate.status === 'Open'}
                  className="flex-1 h-10 rounded-[8px] bg-[#10B981] text-white text-[13px] font-semibold hover:bg-[#059669] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Open
                </button>
                <button 
                  onClick={() => handleGateAction(gate.id, 'Closed')}
                  disabled={gate.status === 'Closed'}
                  className="flex-1 h-10 rounded-[8px] bg-[#475569] text-white text-[13px] font-semibold hover:bg-[#334155] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Close
                </button>
                <button 
                  onClick={() => handleGateAction(gate.id, 'Lockdown')}
                  disabled={gate.status === 'Lockdown'}
                  className="flex-1 h-10 rounded-[8px] bg-[#E5342B] text-white text-[13px] font-semibold hover:bg-[#C4291C] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" /> Lockdown
                </button>
              </div>

            </div>
          ))}
        </div>
      </WidgetCard>
    </StaffLayout>
  )
}
