import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { Bell, AlertTriangle, Info, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'Alert' | 'Bulletin' | 'System'
  priority: 'High' | 'Normal'
  isRead: boolean
  requiresAck: boolean
}

export const StaffNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Severe Weather Warning', message: 'Lightning spotted 5 miles away. Prepare for potential delay protocols.', time: '10m ago', type: 'Alert', priority: 'High', isRead: false, requiresAck: true },
    { id: '2', title: 'Shift Briefing Update', message: 'Gate C will remain open 30 minutes longer than scheduled.', time: '1h ago', type: 'Bulletin', priority: 'Normal', isRead: false, requiresAck: false },
    { id: '3', title: 'Network Maintenance', message: 'Brief scanner offline period expected at 15:00 for 5 minutes.', time: '2h ago', type: 'System', priority: 'Normal', isRead: true, requiresAck: false },
  ])

  const handleAck = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true, requiresAck: false } : n))
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true, requiresAck: false })))
  }

  return (
    <StaffLayout>
      <PageHeader 
        title="Notifications" 
        subtitle="Important alerts and broadcasts from Command Center."
        actions={
          <button onClick={handleMarkAllRead} className="h-[36px] px-4 rounded-[8px] bg-white border border-[#E2E8F0] text-[#0F172A] font-medium text-[13px] hover:bg-[#F8FAFC] transition-colors">
            Mark all as read
          </button>
        }
      />

      <WidgetCard title="Inbox" icon={Bell} iconColor="#2563EB">
        <div className="flex flex-col gap-3">
          {notifications.map(n => (
            <div key={n.id} className={cn("p-4 rounded-xl border flex gap-4 transition-all", 
              !n.isRead ? "bg-[#F8FAFC] border-[#CBD5E1]" : "bg-white border-[#E2E8F0]",
              n.priority === 'High' && !n.isRead ? "border-l-4 border-l-red-500" : ""
            )}>
              <div className="shrink-0 mt-1">
                {n.type === 'Alert' ? <AlertTriangle className={cn("w-5 h-5", !n.isRead ? "text-red-500" : "text-[#94A3B8]")} /> :
                 n.type === 'Bulletin' ? <Info className={cn("w-5 h-5", !n.isRead ? "text-blue-500" : "text-[#94A3B8]")} /> :
                 <Bell className={cn("w-5 h-5", !n.isRead ? "text-slate-700" : "text-[#94A3B8]")} />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className={cn("text-[15px]", !n.isRead ? "font-bold text-[#0F172A]" : "font-semibold text-[#475569]")}>{n.title}</h3>
                    {n.priority === 'High' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">Urgent</span>}
                  </div>
                  <span className="text-[12px] text-[#64748B] whitespace-nowrap">{n.time}</span>
                </div>
                <p className={cn("text-[14px]", !n.isRead ? "text-[#334155]" : "text-[#64748B]")}>{n.message}</p>
                
                {n.requiresAck && (
                  <div className="mt-3">
                    <button onClick={() => handleAck(n.id)} className="h-8 px-4 rounded-[6px] bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge
                    </button>
                  </div>
                )}
              </div>
              
              {!n.isRead && !n.requiresAck && (
                <button onClick={() => handleAck(n.id)} className="shrink-0 text-[#94A3B8] hover:text-[#2563EB] transition-colors mt-1" title="Mark as read">
                  <Circle className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </WidgetCard>
    </StaffLayout>
  )
}
