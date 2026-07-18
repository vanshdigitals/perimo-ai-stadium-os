import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { PackagePlus, Activity, Shield, Hammer, Send, Clock, CheckCircle } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'

type RequestType = 'Medical' | 'Security' | 'Maintenance' | 'Logistics'

interface ResourceRequest {
  id: string
  type: RequestType
  details: string
  location: string
  time: string
  status: 'Pending' | 'Dispatched' | 'Resolved'
}

export const StaffResources: React.FC = () => {
  const { toast } = useApp()
  const [reqType, setReqType] = useState<RequestType>('Logistics')
  const [location, setLocation] = useState('Sector 104, North Concourse')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [requests, setRequests] = useState<ResourceRequest[]>([
    { id: 'REQ-911', type: 'Maintenance', details: 'Broken barrier at gate C', location: 'Gate C', time: '15m ago', status: 'Dispatched' },
    { id: 'REQ-910', type: 'Logistics', details: 'Need 5 more scanner batteries', location: 'Gate C', time: '1h ago', status: 'Resolved' },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!details.trim() || !location.trim()) return
    
    setIsSubmitting(true)
    setTimeout(() => {
      setRequests(prev => [{
        id: `REQ-${Math.floor(Math.random() * 1000)}`,
        type: reqType,
        details,
        location,
        time: 'Just now',
        status: 'Pending'
      }, ...prev])
      
      toast({ type: 'success', title: 'Request Submitted', message: `${reqType} resource requested successfully.` })
      setDetails('')
      setIsSubmitting(false)
    }, 1000)
  }

  const types: { id: RequestType, icon: any, color: string, bg: string }[] = [
    { id: 'Medical', icon: Activity, color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
    { id: 'Security', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { id: 'Maintenance', icon: Hammer, color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { id: 'Logistics', icon: PackagePlus, color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
  ]

  return (
    <StaffLayout>
      <PageHeader title="Request Resources" subtitle="Request additional personnel or equipment to your zone." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Request Form */}
        <div className="col-span-1 lg:col-span-7">
          <WidgetCard title="New Request" icon={PackagePlus} iconColor="#2563EB">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-3">What do you need?</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {types.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setReqType(t.id)}
                      className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", 
                        reqType === t.id ? `${t.bg} border-${t.color.split('-')[1]}-500 shadow-sm` : "bg-white border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      )}
                    >
                      <t.icon className={cn("w-6 h-6 mb-2", reqType === t.id ? t.color : "text-[#64748B]")} />
                      <span className={cn("text-[12px] font-bold", reqType === t.id ? t.color : "text-[#475569]")}>{t.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full h-11 px-4 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F172A] mb-2">Additional Details</label>
                <textarea 
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="E.g. We need 3 more radios and 5 spare batteries..."
                  className="w-full h-24 p-4 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all resize-none"
                  required
                />
              </div>

              <div className="pt-2 border-t border-[#E2E8F0]">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !details.trim() || !location.trim()}
                  className="w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[#2563EB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" /> {isSubmitting ? 'Sending Request...' : 'Send Request'}
                </button>
              </div>

            </form>
          </WidgetCard>
        </div>

        {/* Request Tracker */}
        <div className="col-span-1 lg:col-span-5">
          <WidgetCard title="My Active Requests" icon={Activity} iconColor="#475569">
            <div className="flex flex-col gap-3">
              {requests.map(req => {
                const typeInfo = types.find(t => t.id === req.type)!
                return (
                  <div key={req.id} className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex items-start gap-4 shadow-sm">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", typeInfo.bg)}>
                      <typeInfo.icon className={cn("w-5 h-5", typeInfo.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[12px] font-bold text-[#0F172A]">{req.id}</span>
                        <span className="text-[11px] text-[#64748B]">{req.time}</span>
                      </div>
                      <div className="text-[13px] font-medium text-[#475569] mb-2">{req.details}</div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F1F5F9]">
                        <span className="text-[11px] font-semibold text-[#94A3B8] uppercase">{req.location}</span>
                        <div className={cn("flex items-center gap-1 text-[11px] font-bold uppercase", 
                          req.status === 'Pending' ? "text-orange-600" :
                          req.status === 'Dispatched' ? "text-blue-600" : "text-emerald-600"
                        )}>
                          {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                          {req.status === 'Dispatched' && <Activity className="w-3.5 h-3.5" />}
                          {req.status === 'Resolved' && <CheckCircle className="w-3.5 h-3.5" />}
                          {req.status}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </WidgetCard>
        </div>

      </div>
    </StaffLayout>
  )
}
