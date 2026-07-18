import React, { useState, useEffect } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { Clock, Coffee, Play, LogOut, CheckCircle2, History, User } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useApp } from '@/contexts/AppContext'

type ShiftState = 'Not Started' | 'Working' | 'On Break' | 'Completed'

export const StaffShift: React.FC = () => {
  const { toast } = useApp()
  const [shiftState, setShiftState] = useState<ShiftState>('Not Started')
  const [elapsed, setElapsed] = useState(0) // seconds

  useEffect(() => {
    if (shiftState !== 'Working') return
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [shiftState])

  const handleAction = (newState: ShiftState, msg: string) => {
    setShiftState(newState)
    toast({ type: 'success', title: 'Shift Update', message: msg })
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const attendanceLog = [
    { date: 'Today', status: 'Present', hours: '4h 30m (Active)' },
    { date: 'Yesterday', status: 'Present', hours: '8h 00m' },
    { date: '16-Jul-2026', status: 'Sick Leave', hours: '0h' },
    { date: '15-Jul-2026', status: 'Present', hours: '8h 15m' },
  ]

  return (
    <StaffLayout>
      <PageHeader title="Shift Management" subtitle="Track your working hours and breaks." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Active Shift Controls */}
        <div className="col-span-1 lg:col-span-8">
          <WidgetCard title="Active Shift" icon={Clock} iconColor="#2563EB">
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl mb-6">
              <div className="flex-1 text-center md:text-left">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Status</div>
                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-[13px] font-bold", 
                  shiftState === 'Working' ? "bg-emerald-100 text-emerald-700" :
                  shiftState === 'On Break' ? "bg-orange-100 text-orange-700" :
                  shiftState === 'Completed' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-700"
                )}>
                  {shiftState === 'Working' && <Play className="w-3.5 h-3.5" />}
                  {shiftState === 'On Break' && <Coffee className="w-3.5 h-3.5" />}
                  {shiftState === 'Not Started' && <Clock className="w-3.5 h-3.5" />}
                  {shiftState === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {shiftState}
                </div>
              </div>

              <div className="flex-1 text-center">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Timer</div>
                <div className="text-[40px] font-mono font-bold text-[#0F172A] leading-none tracking-tight">
                  {shiftState === 'Not Started' ? '00:00:00' : formatTime(elapsed)}
                </div>
              </div>

              <div className="flex-1 text-center md:text-right hidden sm:block">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Schedule</div>
                <div className="text-[16px] font-bold text-[#0F172A]">14:00 - 22:00</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button 
                onClick={() => handleAction('Working', 'Checked in successfully.')}
                disabled={shiftState !== 'Not Started'}
                className="h-12 flex flex-col items-center justify-center rounded-[8px] bg-[#2563EB] text-white font-semibold disabled:opacity-50 disabled:grayscale transition-colors hover:bg-[#1D4ED8]"
              >
                <div className="flex items-center gap-2 text-[13px]"><Play className="w-4 h-4" /> Check In</div>
              </button>
              
              <button 
                onClick={() => handleAction('On Break', 'Break started.')}
                disabled={shiftState !== 'Working'}
                className="h-12 flex flex-col items-center justify-center rounded-[8px] bg-orange-500 text-white font-semibold disabled:opacity-50 disabled:grayscale transition-colors hover:bg-orange-600"
              >
                <div className="flex items-center gap-2 text-[13px]"><Coffee className="w-4 h-4" /> Start Break</div>
              </button>
              
              <button 
                onClick={() => handleAction('Working', 'Break ended. Shift resumed.')}
                disabled={shiftState !== 'On Break'}
                className="h-12 flex flex-col items-center justify-center rounded-[8px] bg-emerald-500 text-white font-semibold disabled:opacity-50 disabled:grayscale transition-colors hover:bg-emerald-600"
              >
                <div className="flex items-center gap-2 text-[13px]"><Play className="w-4 h-4" /> Resume</div>
              </button>
              
              <button 
                onClick={() => handleAction('Completed', 'Checked out successfully.')}
                disabled={shiftState === 'Not Started' || shiftState === 'Completed'}
                className="h-12 flex flex-col items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-semibold disabled:opacity-50 disabled:grayscale transition-colors hover:bg-[#F8FAFC]"
              >
                <div className="flex items-center gap-2 text-[13px]"><LogOut className="w-4 h-4" /> Check Out</div>
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* Supervisor & Attendance */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-5">
          
          <WidgetCard title="Assignment Details" icon={User} iconColor="#475569">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[13px] text-[#64748B]">Assigned Zone</span>
                <span className="text-[13px] font-bold text-[#0F172A]">North Concourse</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#E2E8F0]">
                <span className="text-[13px] text-[#64748B]">Role</span>
                <span className="text-[13px] font-bold text-[#0F172A]">Gate Supervisor</span>
              </div>
              <div className="flex flex-col py-2">
                <span className="text-[13px] text-[#64748B] mb-1">Direct Supervisor</span>
                <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0]">
                  <div className="w-8 h-8 rounded-full bg-[#E0E7FF] text-[#3730A3] flex items-center justify-center font-bold text-[12px]">MS</div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#0F172A]">Marcus Smith</span>
                    <span className="text-[11px] text-[#64748B]">Ext: 4402</span>
                  </div>
                </div>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Attendance Log" icon={History} iconColor="#475569">
            <div className="flex flex-col gap-3">
              {attendanceLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-[#E2E8F0] bg-white">
                  <div>
                    <div className="text-[13px] font-bold text-[#0F172A]">{log.date}</div>
                    <div className="text-[12px] text-[#64748B]">{log.hours}</div>
                  </div>
                  <div className={cn("px-2 py-1 rounded-md text-[11px] font-bold uppercase", 
                    log.status === 'Present' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                    "bg-orange-50 text-orange-700 border border-orange-200"
                  )}>
                    {log.status}
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
