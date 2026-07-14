import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layouts/Header'
import { RoleCard } from '@/components/ui/RoleCard'

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle font-sans text-text">
      <Header theme="light" />
      
      <main className="flex-1 flex flex-col">
        <div className="w-full bg-[#F7F8FA] animate-perimo-fade min-h-screen">
          <div className="w-full max-w-[1200px] mx-auto p-[clamp(40px,7vw,72px)_clamp(20px,5vw,48px)_clamp(56px,9vw,104px)]">
            
            <div className="text-center max-w-[680px] mx-auto mb-[clamp(40px,6vw,56px)]">
              <div className="inline-block text-[13px] font-semibold tracking-[0.04em] text-brand bg-brand/10 px-3 py-1 rounded-full mb-5">
                GET STARTED
              </div>
              <h1 className="font-display font-semibold text-[clamp(30px,4.2vw,46px)] leading-[1.1] tracking-[-0.02em] text-text mb-3.5">
                Choose Your Stadium Experience
              </h1>
              <p className="text-[clamp(15px,2vw,18px)] leading-[1.55] text-text-muted m-0">
                Every role has a dedicated, secure entry point into Perimo.
              </p>
            </div>

            <div className="flex justify-center mb-[clamp(48px,7vw,64px)]">
              <div className="w-full max-w-[900px] bg-white border border-surface-border rounded-[20px] p-[clamp(32px,4vw,44px)] flex items-center gap-[clamp(24px,4vw,48px)] flex-wrap min-h-[240px] transition-all hover:border-brand/40 hover:shadow-[0_0_0_1px_rgba(22,82,240,0.25),0_12px_40px_rgba(22,82,240,0.12)] hover:-translate-y-0.5">
                
                <div className="flex-1 basis-[380px] min-w-[280px]">
                  <div className="flex items-center gap-3.5 mb-5 flex-wrap">
                    <div className="w-14 h-14 rounded-[14px] bg-brand/10 text-brand flex items-center justify-center shrink-0">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M4.5 20c0-4.14 3.36-7 7.5-7s7.5 2.86 7.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-xs font-semibold tracking-[0.03em] text-brand bg-brand/10 px-3 py-1 rounded-full">
                      PUBLIC ACCESS
                    </span>
                  </div>
                  <h2 className="font-display font-semibold text-[clamp(22px,2.6vw,28px)] text-text mb-2.5">
                    Fan Portal
                  </h2>
                  <p className="text-[15px] leading-[1.6] text-text-muted mb-7 max-w-[460px]">
                    Experience the stadium with AI navigation, multilingual assistant, live updates, accessibility support and personalized recommendations.
                  </p>
                  <button 
                    onClick={() => navigate('/auth/fan/login')}
                    className="h-12 border-none rounded-lg bg-brand text-white font-sans font-semibold text-[15px] cursor-pointer transition-colors px-7 hover:bg-brand-hover"
                  >
                    Continue as Fan
                  </button>
                </div>

                <div className="flex-1 basis-[220px] min-w-[200px] max-w-[280px] h-[180px] relative flex items-center justify-center">
                  <div className="absolute w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(22,82,240,0.1)_0%,rgba(22,82,240,0)_70%)]"></div>
                  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" className="relative">
                    <circle cx="70" cy="70" r="58" stroke="#E2E5EA" strokeWidth="1.5"/>
                    <path d="M108 32 A58 58 0 1 1 78 15" stroke="#1652F0" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.85"/>
                    <circle cx="106" cy="20" r="5" fill="#1652F0"/>
                    <circle cx="70" cy="70" r="4" fill="#1652F0" opacity="0.5"/>
                    <circle cx="40" cy="95" r="3" fill="#6B7280" opacity="0.6"/>
                    <circle cx="95" cy="100" r="2.5" fill="#6B7280" opacity="0.5"/>
                  </svg>
                </div>

              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-semibold tracking-[0.06em] text-text-muted whitespace-nowrap">
                INTERNAL OPERATIONS
              </span>
              <div className="flex-1 h-px bg-surface-border"></div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(16px,2.5vw,24px)] mb-[clamp(16px,2.5vw,24px)]">
              <RoleCard 
                title="Volunteer Operations"
                description="Access assigned tasks, AI recommendations, incident reporting and shift management."
                badgeText="INVITE ONLY"
                buttonText="Volunteer Login"
                onClick={() => navigate('/auth/volunteer/login')}
                badgeTheme="secondary"
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/><circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.5"/><path d="M8.5 15.5h7M9.5 18h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              />
              <RoleCard 
                title="Stadium Staff"
                description="Operations staff, security, medical teams and transport coordinators."
                badgeText="PRE-CREATED ACCOUNTS"
                buttonText="Staff Login"
                onClick={() => navigate('/auth/staff/login')}
                badgeTheme="secondary"
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              />
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[clamp(16px,2.5vw,24px)]">
              <RoleCard 
                title="Command Center Administrator"
                description="Command Center access for stadium administrators and operations managers."
                badgeText="ENTERPRISE · RESTRICTED"
                buttonText="Admin Login"
                onClick={() => navigate('/auth/admin/login')}
                isPrimary={true}
                badgeTheme="dark"
                icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="5" y="10.5" width="14" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M8 10.5V8a4 4 0 118 0v2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="15" r="1.3" fill="currentColor"/></svg>}
              />
              
              <div className="bg-transparent border-[1.5px] border-dashed border-surface-border rounded-[20px] p-[clamp(24px,3vw,32px)] flex flex-col items-start justify-center min-h-[180px] box-border">
                <div className="w-11 h-11 rounded-md bg-surface-subtle text-text-muted flex items-center justify-center mb-[18px]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/><path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
                <h2 className="font-display font-semibold text-[17px] text-text-muted mb-1.5">
                  Medical Operations
                </h2>
                <p className="text-[13px] leading-[1.5] text-text-muted m-0">
                  Reserved for a future role. Coming soon.
                </p>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
