import React from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { WidgetCard, PageHeader } from '@/components/widgets'
import { Shield, Clock, CheckCircle2, AlertTriangle, Radio, Play, Navigation, Bell } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { useNavigate } from 'react-router-dom'

export const StaffDashboard: React.FC = () => {
  const { user } = useApp()
  const navigate = useNavigate()

  // Mock data for the dashboard
  const currentTask = { title: 'Crowd Control at Gate C', time: 'Started 45m ago', priority: 'High' }
  const shiftProgress = 65 // percentage
  const quickActions = [
    { label: 'Report Incident', icon: AlertTriangle, color: 'bg-red-500 hover:bg-red-600', path: '/staff/incidents' },
    { label: 'Scanner', icon: Shield, color: 'bg-blue-600 hover:bg-blue-700', path: '/staff/scanner' },
    { label: 'Radio', icon: Radio, color: 'bg-slate-700 hover:bg-slate-800', path: '/staff/comms' },
    { label: 'Gate Ops', icon: Navigation, color: 'bg-emerald-600 hover:bg-emerald-700', path: '/staff/gates' },
  ]
  const recentActivity = [
    { action: 'Task Completed: Swept Sector 4', time: '10m ago', icon: CheckCircle2 },
    { action: 'Shift Break Ended', time: '1h ago', icon: Clock },
    { action: 'Zone Briefing Read', time: '2h ago', icon: Bell },
  ]

  return (
    <StaffLayout>
      <PageHeader 
        title={`Welcome back, ${user.name.split(' ')[0]}`} 
        subtitle="Current Shift: 14:00 - 22:00 | Assigned: North Concourse"
      />

      {/* Emergency Level Strip */}
      <div className="mb-6 flex items-center justify-between bg-[#F0FDF4] border border-[#BBF7D0] p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse" />
          <span className="text-[14px] font-semibold text-[#166534]">Threat Level: LOW (Alpha)</span>
        </div>
        <span className="text-[13px] text-[#166534] font-medium hidden sm:block">Standard operations in effect.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5">
        
        {/* Left Column (Main Status) */}
        <div className="col-span-1 md:col-span-8 flex flex-col gap-5">
          
          {/* Current Task */}
          <WidgetCard title="Active Assignment" icon={Play} iconColor="#2563EB">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">{currentTask.title}</h3>
                <div className="flex items-center gap-3 text-[13px] text-[#64748B]">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {currentTask.time}</span>
                  <span className="flex items-center gap-1 text-[#E5342B]"><AlertTriangle className="w-3.5 h-3.5" /> {currentTask.priority} Priority</span>
                </div>
              </div>
              <button onClick={() => navigate('/staff/tasks')} className="w-full sm:w-auto px-4 py-2 bg-[#2563EB] text-white text-[13px] font-semibold rounded-[8px] hover:bg-[#1D4ED8] transition-colors">
                View Details
              </button>
            </div>
          </WidgetCard>

          {/* Quick Actions Grid */}
          <WidgetCard title="Quick Actions" icon={Radio} iconColor="#0F172A">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => navigate(action.path)}
                  className={`flex flex-col items-center justify-center gap-2 h-[100px] rounded-xl text-white shadow-sm transition-transform active:scale-95 ${action.color}`}
                >
                  <action.icon className="w-6 h-6" />
                  <span className="text-[12px] font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Right Column (Metrics & Log) */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-5">
          
          {/* Shift Progress */}
          <WidgetCard title="Shift Progress" icon={Clock} iconColor="#475569">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-[13px] font-medium">
                <span className="text-[#64748B]">Elapsed: 4h 30m</span>
                <span className="text-[#0F172A]">Remaining: 3h 30m</span>
              </div>
              <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${shiftProgress}%` }} />
              </div>
            </div>
          </WidgetCard>

          {/* Activity Log */}
          <WidgetCard title="Recent Activity" icon={CheckCircle2} iconColor="#10B981">
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-[8px] bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <activity.icon className="w-4 h-4 text-[#64748B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#0F172A] truncate">{activity.action}</div>
                    <div className="text-[11px] text-[#64748B]">{activity.time}</div>
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
