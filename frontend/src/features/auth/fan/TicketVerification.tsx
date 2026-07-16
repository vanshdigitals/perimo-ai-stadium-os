import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '../shared/AuthLayout'
import { Check } from 'lucide-react'

export const TicketVerification: React.FC = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'scanning' | 'verified'>('scanning')

  useEffect(() => {
    // Simulate verification delay
    const timer1 = setTimeout(() => setStatus('verified'), 2000)
    // Auto transition
    const timer2 = setTimeout(() => navigate('/auth/fan/welcome'), 3500)
    
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [navigate])

  return (
    <AuthLayout>
      <div className="bg-white border border-surface-border rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] max-w-[360px] mx-auto animate-perimo-fade relative">
        {/* Ticket Header */}
        <div className="bg-[#2563EB] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_100%)]"></div>
          <h2 className="font-display font-bold text-xl mb-1 relative z-10">FIFA World Cup 2026™</h2>
          <p className="text-white/80 text-sm font-medium relative z-10">Quarter Final 1</p>
        </div>

        {/* Ticket Body */}
        <div className="p-6 pb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">Stadium</p>
              <p className="font-semibold text-text">MetLife Stadium</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-muted font-medium mb-0.5">Kickoff</p>
              <p className="font-semibold text-text">20:00 EST</p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8 bg-surface-subtle rounded-xl p-4">
            <div className="text-center">
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">Gate</p>
              <p className="font-display font-bold text-xl text-text">B4</p>
            </div>
            <div className="w-px h-8 bg-surface-border"></div>
            <div className="text-center">
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">Section</p>
              <p className="font-display font-bold text-xl text-text">112</p>
            </div>
            <div className="w-px h-8 bg-surface-border"></div>
            <div className="text-center">
              <p className="text-[11px] text-text-muted font-semibold uppercase tracking-wider mb-1">Seat</p>
              <p className="font-display font-bold text-xl text-text">15</p>
            </div>
          </div>

          {/* QR Code Area */}
          <div className="relative mx-auto w-[180px] h-[180px] flex items-center justify-center bg-white border border-surface-border p-4 rounded-2xl shadow-sm">
            <svg width="100%" height="100%" viewBox="0 0 100 100" className="opacity-90">
              <rect x="10" y="10" width="35" height="35" fill="none" stroke="#0F172A" strokeWidth="4" />
              <rect x="55" y="10" width="35" height="35" fill="none" stroke="#0F172A" strokeWidth="4" />
              <rect x="10" y="55" width="35" height="35" fill="none" stroke="#0F172A" strokeWidth="4" />
              <rect x="20" y="20" width="15" height="15" fill="#0F172A" />
              <rect x="65" y="20" width="15" height="15" fill="#0F172A" />
              <rect x="20" y="65" width="15" height="15" fill="#0F172A" />
              <rect x="60" y="60" width="10" height="10" fill="#0F172A" />
              <rect x="75" y="75" width="10" height="10" fill="#0F172A" />
              <rect x="55" y="80" width="15" height="5" fill="#0F172A" />
            </svg>

            {status === 'scanning' && (
              <div className="absolute top-0 left-0 w-full h-[2px] bg-brand animate-[scan_1.5s_ease-in-out_infinite] shadow-[0_0_8px_rgba(37,99,235,0.8)]"></div>
            )}
            {status === 'verified' && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-2xl animate-in fade-in duration-300">
                <div className="bg-[#157A45] rounded-full p-3 shadow-lg">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-center h-6">
            {status === 'scanning' ? (
              <p className="text-sm font-medium text-brand animate-pulse">Verifying Ticket...</p>
            ) : (
              <p className="text-sm font-bold text-[#157A45]">Ticket Verified</p>
            )}
          </div>
        </div>

        {/* Perforated Edge */}
        <div className="absolute top-[88px] -left-3 w-6 h-6 bg-surface-subtle rounded-full border-r border-surface-border"></div>
        <div className="absolute top-[88px] -right-3 w-6 h-6 bg-surface-subtle rounded-full border-l border-surface-border"></div>
      </div>
    </AuthLayout>
  )
}
