import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { ScanLine, Keyboard, CheckCircle, XCircle, History, User } from 'lucide-react'
import { cn } from '@/utils/cn'

interface ScanHistory {
  id: string
  time: string
  type: 'Success' | 'Denied'
  ticketId: string
  name?: string
  reason?: string
}

export const StaffScanner: React.FC = () => {
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')
  const [manualCode, setManualCode] = useState('')
  const [scanState, setScanState] = useState<'idle' | 'success' | 'error'>('idle')
  const [history, setHistory] = useState<ScanHistory[]>([
    { id: '1', time: 'Just now', type: 'Success', ticketId: 'TKT-8992', name: 'Michael Chen' },
    { id: '2', time: '2m ago', type: 'Denied', ticketId: 'TKT-4412', reason: 'Invalid Zone' },
    { id: '3', time: '5m ago', type: 'Success', ticketId: 'TKT-1102', name: 'Sarah Jenkins' },
  ])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return

    // Mock validation logic
    const isSuccess = manualCode.length > 5
    setScanState(isSuccess ? 'success' : 'error')
    
    setTimeout(() => {
      setHistory(prev => [{
        id: Date.now().toString(),
        time: 'Just now',
        type: isSuccess ? 'Success' : 'Denied',
        ticketId: manualCode.toUpperCase(),
        name: isSuccess ? 'Valid Fan' : undefined,
        reason: !isSuccess ? 'Invalid Ticket Format' : undefined
      }, ...prev])
      setManualCode('')
      setScanState('idle')
    }, 1500)
  }

  return (
    <StaffLayout>
      <PageHeader title="QR Scanner" subtitle="Validate tickets and credentials for entry." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">
        {/* Scanner Canvas */}
        <div className="col-span-1 lg:col-span-8">
          <WidgetCard title="Active Scanner" icon={ScanLine} iconColor="#2563EB">
            
            {/* Mode Toggle */}
            <div className="flex bg-[#F1F5F9] p-1 rounded-lg w-full max-w-[300px] mx-auto mb-6">
              <button onClick={() => setMode('camera')} className={cn("flex-1 h-9 rounded-md text-[13px] font-medium flex items-center justify-center gap-2 transition-all", mode === 'camera' ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]")}>
                <ScanLine className="w-4 h-4" /> Camera
              </button>
              <button onClick={() => setMode('manual')} className={cn("flex-1 h-9 rounded-md text-[13px] font-medium flex items-center justify-center gap-2 transition-all", mode === 'manual' ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]")}>
                <Keyboard className="w-4 h-4" /> Manual
              </button>
            </div>

            {/* Viewport */}
            <div className="relative w-full max-w-[500px] mx-auto aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-[#E2E8F0]">
              
              {mode === 'camera' ? (
                <>
                  {/* Fake Camera View */}
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2805&auto=format&fit=crop')] bg-cover bg-center filter blur-[2px]" />
                  <div className="absolute inset-0 bg-black/20" />
                  
                  {/* Scanner Reticle */}
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-2 border-white/50 rounded-xl">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
                    {scanState === 'idle' && (
                      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#2563EB] shadow-[0_0_8px_2px_rgba(37,99,235,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                    )}
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full bg-[#F8FAFC] flex items-center justify-center p-6">
                  <form onSubmit={handleManualSubmit} className="w-full max-w-sm flex flex-col gap-4">
                    <label className="text-[13px] font-semibold text-[#0F172A] text-center">Enter Ticket or Credential ID</label>
                    <input 
                      type="text" 
                      value={manualCode}
                      onChange={e => setManualCode(e.target.value)}
                      placeholder="e.g. TKT-12345"
                      className="w-full h-12 text-center text-[16px] tracking-widest font-mono rounded-[8px] border-2 border-[#E2E8F0] outline-none focus:border-[#2563EB]"
                      autoFocus
                    />
                    <button type="submit" disabled={!manualCode.trim() || scanState !== 'idle'} className="h-12 w-full rounded-[8px] bg-[#2563EB] text-white font-bold hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors">
                      Validate
                    </button>
                  </form>
                </div>
              )}

              {/* Status Overlays */}
              {scanState === 'success' && (
                <div className="absolute inset-0 bg-[#16A34A]/90 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in-95 duration-200">
                  <CheckCircle className="w-16 h-16 mb-4" />
                  <h2 className="text-[24px] font-bold">VALID ENTRY</h2>
                  <p className="text-white/80">Ticket Verified</p>
                </div>
              )}

              {scanState === 'error' && (
                <div className="absolute inset-0 bg-[#DC2626]/90 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in-95 duration-200">
                  <XCircle className="w-16 h-16 mb-4" />
                  <h2 className="text-[24px] font-bold">ACCESS DENIED</h2>
                  <p className="text-white/80">Invalid or Used Ticket</p>
                </div>
              )}

            </div>
            
            {mode === 'camera' && (
              <p className="text-center text-[13px] text-[#64748B] mt-6">Position QR code within the frame</p>
            )}
          </WidgetCard>
        </div>

        {/* History Column */}
        <div className="col-span-1 lg:col-span-4">
          <WidgetCard title="Recent Scans" icon={History} iconColor="#475569">
            <div className="flex flex-col gap-3">
              {history.map((scan) => (
                <div key={scan.id} className="flex items-start gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", scan.type === 'Success' ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]")}>
                    {scan.type === 'Success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-mono text-[12px] font-bold text-[#0F172A]">{scan.ticketId}</span>
                      <span className="text-[11px] text-[#94A3B8]">{scan.time}</span>
                    </div>
                    {scan.type === 'Success' ? (
                      <div className="flex items-center gap-1 text-[12px] text-[#64748B]">
                        <User className="w-3.5 h-3.5" /> {scan.name}
                      </div>
                    ) : (
                      <div className="text-[12px] text-[#DC2626] font-medium">{scan.reason}</div>
                    )}
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
