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
  const quickActions = [
    { label: 'Report Incident', icon: AlertTriangle, bg: 'bg-orange-500 hover:bg-orange-600', path: '/staff/incidents' },
    { label: 'Scanner', icon: Shield, bg: 'bg-blue-600 hover:bg-blue-700', path: '/staff/scanner' },
    { label: 'Radio', icon: Radio, bg: 'bg-[#0F172A] hover:bg-[#1E293B]', path: '/staff/comms' },
    { label: 'Gate Ops', icon: Navigation, bg: 'bg-emerald-600 hover:bg-emerald-700', path: '/staff/gates' },
  ]
  const recentActivity = [
    { action: 'Task Completed: Swept Sector 4', time: '10m ago', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { action: 'Shift Break Ended', time: '1h ago', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { action: 'Zone Briefing Read', time: '2h ago', icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50' },
  ]

  return (
    <StaffLayout>
      <PageHeader 
        title={`Welcome back, ${user.name.split(' ')[0]}`} 
        subtitle="Current Shift: 14:00 - 22:00 | Assigned: North Concourse"
      />

      {/* Emergency Level Strip */}
      <div className="mb-8 flex items-center justify-between bg-green-50 border border-green-200 p-4 sm:p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>
          <span className="text-[14px] font-bold text-green-800 tracking-wide">Threat Level: LOW (Alpha)</span>
        </div>
        <span className="text-[13px] text-green-700 font-medium hidden sm:block">Standard operations in effect.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8">
        
        {/* Left Column (Main Status) */}
        <div className="lg:col-span-8 flex flex-col gap-6 lg:gap-8">
          
          {/* Current Task */}
          <WidgetCard title="Active Assignment" icon={Play} iconColor="#2563EB">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-6">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">{currentTask.title}</h3>
                <div className="flex items-center gap-4 text-[13px] font-medium text-[#64748B]">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {currentTask.time}</span>
                  <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-1 rounded-md"><AlertTriangle className="w-4 h-4" /> {currentTask.priority} Priority</span>
                </div>
              </div>
              <button onClick={() => navigate('/staff/tasks')} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-[14px] font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap">
                View Details
              </button>
            </div>
          </WidgetCard>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className={`group flex flex-col items-center justify-center gap-3 h-[110px] rounded-2xl text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95 ${action.bg}`}
              >
                <action.icon className="w-7 h-7 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                <span className="text-[13px] font-bold tracking-wide">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (Activity & Shift) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
          
          {/* Shift Details */}
          <WidgetCard title="My Shift" icon={Clock} iconColor="#0F172A">
            <div className="p-6 flex flex-col gap-5">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[13px] font-bold text-[#64748B] uppercase tracking-wider">Elapsed Time</span>
                  <span className="text-[24px] font-black text-[#0F172A] leading-none">02:14:45</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[13px] font-medium text-[#475569]">
                <span>Started: 14:00</span>
                <span>Ends: 22:00</span>
              </div>
              <button onClick={() => navigate('/staff/shifts')} className="w-full py-3 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-bold rounded-xl hover:bg-[#F1F5F9] transition-colors mt-2">
                Manage Shift
              </button>
            </div>
          </WidgetCard>

          {/* Recent Activity */}
          <WidgetCard title="Recent Activity" icon={Bell} iconColor="#64748B">
            <div className="flex flex-col">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[14px] font-bold text-[#0F172A] mb-0.5 leading-tight">{item.action}</p>
                    <p className="text-[12px] font-medium text-[#64748B]">{item.time}</p>
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
