import React from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { User, Award, ShieldCheck, FileText } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export const StaffProfile: React.FC = () => {
  const { user } = useApp()

  const trainings = [
    { name: 'Basic First Aid', date: 'Jan 15, 2026', status: 'Valid' },
    { name: 'Crowd Control L2', date: 'Feb 10, 2026', status: 'Valid' },
    { name: 'Emergency Evac', date: 'Mar 05, 2026', status: 'Expires Soon' },
  ]

  return (
    <StaffLayout>
      <PageHeader title="My Profile" subtitle="Manage your staff identity and credentials." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        
        {/* Digital ID Badge */}
        <div className="col-span-1 lg:col-span-4">
          <WidgetCard title="Digital ID" icon={User} iconColor="#2563EB">
            <div className="flex flex-col items-center p-6 bg-gradient-to-b from-[#1E40AF] to-[#1e3a8a] rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <ShieldCheck className="w-8 h-8 text-white/20" />
              </div>
              <div className="w-24 h-24 bg-white p-1 rounded-full mb-4 shadow-lg z-10">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h2 className="text-[22px] font-bold tracking-tight mb-1">{user.name}</h2>
              <p className="text-[13px] text-blue-200 font-medium uppercase tracking-widest mb-6">{user.role}</p>
              
              <div className="w-full bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-blue-200 uppercase tracking-wider">ID Number</span>
                  <span className="text-[13px] font-mono font-bold">STF-8492</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-blue-200 uppercase tracking-wider">Clearance</span>
                  <span className="text-[13px] font-bold">Level 3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-blue-200 uppercase tracking-wider">Blood Type</span>
                  <span className="text-[13px] font-bold">O+</span>
                </div>
              </div>

              {/* Fake QR */}
              <div className="mt-6 p-2 bg-white rounded-lg">
                <div className="w-20 h-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover opacity-80" />
              </div>
            </div>
          </WidgetCard>
        </div>

        <div className="col-span-1 lg:col-span-8 flex flex-col gap-5">
          
          {/* Stats */}
          <WidgetCard title="Performance Stats" icon={Award} iconColor="#D97706">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Shifts Completed</div>
                <div className="text-[24px] font-bold text-[#0F172A]">142</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Incidents Handled</div>
                <div className="text-[24px] font-bold text-[#0F172A]">38</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Avg Response</div>
                <div className="text-[24px] font-bold text-[#0F172A]">2.4m</div>
              </div>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <div className="text-[12px] font-semibold text-[#64748B] uppercase mb-1">Rating</div>
                <div className="text-[24px] font-bold text-[#0F172A]">4.9/5</div>
              </div>
            </div>
          </WidgetCard>

          {/* Certifications */}
          <WidgetCard title="Training & Certifications" icon={FileText} iconColor="#475569">
            <div className="flex flex-col gap-3">
              {trainings.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-[#64748B]" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[#0F172A]">{t.name}</h4>
                      <p className="text-[12px] text-[#64748B]">Issued: {t.date}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${t.status === 'Valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                    {t.status}
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
