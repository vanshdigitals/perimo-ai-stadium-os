import React, { useState, useEffect } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { PhoneCall, ShieldAlert, AlertOctagon, HeartPulse, Shield, Map } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export const StaffEmergency: React.FC = () => {
  const { toast } = useApp()
  const navigate = useNavigate()
  const [sosActive, setSosActive] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(3)
  const [isHolding, setIsHolding] = useState(false)

  // Hold to activate logic
  useEffect(() => {
    let timer: any
    if (isHolding && sosCountdown > 0) {
      timer = setTimeout(() => setSosCountdown(c => c - 1), 1000)
    } else if (isHolding && sosCountdown === 0 && !sosActive) {
      setSosActive(true)
      toast({ type: 'error', title: 'SOS ACTIVATED', message: 'Command Center has received your distress signal.' })
    } else if (!isHolding && !sosActive) {
      setSosCountdown(3)
    }
    return () => clearTimeout(timer)
  }, [isHolding, sosCountdown, sosActive, toast])

  return (
    <StaffLayout>
      <PageHeader title="Emergency Mode" subtitle="Immediate actions for critical situations." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* SOS Button Area */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-5">
          <WidgetCard title="Distress Signal" icon={AlertOctagon} iconColor="#DC2626" className="h-full">
            <div className="flex flex-col items-center justify-center py-10">
              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className={cn(
                  "relative w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 select-none",
                  sosActive ? "bg-red-600 animate-pulse scale-95" : 
                  isHolding ? "bg-red-500 scale-95" : "bg-[#DC2626] hover:bg-red-700"
                )}
              >
                {/* Ping rings */}
                {sosActive && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <div className="absolute inset-[-20px] rounded-full border-4 border-red-500 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  </>
                )}
                
                <AlertOctagon className="w-16 h-16 text-white mb-2" />
                <span className="text-white font-bold text-[24px] tracking-widest uppercase">SOS</span>
                
                {/* Hold to activate overlay */}
                {isHolding && !sosActive && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-white font-bold text-[48px]">{sosCountdown}</span>
                  </div>
                )}
              </button>

              <div className="mt-8 text-center">
                <p className={cn("text-[16px] font-bold", sosActive ? "text-red-600" : "text-[#0F172A]")}>
                  {sosActive ? "DISTRESS SIGNAL ACTIVE" : "HOLD 3 SECONDS TO ACTIVATE"}
                </p>
                <p className="text-[13px] text-[#64748B] mt-2 max-w-xs mx-auto">
                  Use only when you are in immediate danger or require urgent emergency assistance.
                </p>
              </div>

              {sosActive && (
                <button 
                  onClick={() => { setSosActive(false); setSosCountdown(3) }}
                  className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-full text-[13px] font-bold hover:bg-slate-900 transition-colors"
                >
                  CANCEL SOS
                </button>
              )}
            </div>
          </WidgetCard>
        </div>

        {/* Quick Protocols */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-5">
          <WidgetCard title="Emergency Protocols" icon={ShieldAlert} iconColor="#475569">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button
                onClick={() => { toast({ type: 'info', title: 'Evacuation routes', message: 'Opening the map with nearest exits and assembly points.' }); navigate('/staff/map'); }}
                className="flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-2xl hover:border-blue-500 hover:shadow-md transition-all group text-center outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Map className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Evacuate Sector</h3>
                <p className="text-[12px] text-[#64748B]">View nearest emergency exits and assembly points.</p>
              </button>

              <button
                onClick={() => toast({ type: 'info', title: 'Medical protocol', message: 'CABC: Check response · Airway · Breathing · Circulation. Nearest AED: Concourse B, Gate 4.' })}
                className="flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-2xl hover:border-red-500 hover:shadow-md transition-all group text-center outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Medical Protocol</h3>
                <p className="text-[12px] text-[#64748B]">First aid steps and AED locations in your zone.</p>
              </button>

              <button
                onClick={() => toast({ type: 'warning', title: 'Active threat — RUN · HIDE · FIGHT', message: 'Evacuate if safe, otherwise shelter, lock/barricade, silence devices, and await all-clear from Command.' })}
                className="flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-2xl hover:border-orange-500 hover:shadow-md transition-all group text-center outline-none focus-visible:ring-2 focus-visible:ring-[#D68A00]"
              >
                <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Active Threat</h3>
                <p className="text-[12px] text-[#64748B]">Lockdown procedures and shelter-in-place guide.</p>
              </button>

              <button
                onClick={() => toast({ type: 'info', title: 'Emergency contacts', message: 'Command Center ext. 5000 · Security ext. 5100 · Medical ext. 5200 · Fire/Rescue 911.' })}
                className="flex flex-col items-center justify-center p-6 bg-white border border-[#E2E8F0] rounded-2xl hover:border-slate-800 hover:shadow-md transition-all group text-center outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A]"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-[#0F172A] mb-1">Emergency Contacts</h3>
                <p className="text-[12px] text-[#64748B]">Direct lines to police, fire, and medical teams.</p>
              </button>

            </div>
          </WidgetCard>
        </div>

      </div>
    </StaffLayout>
  )
}
