import React, { useState, useEffect } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard } from '@/components/widgets'
import { Hash, Search, AlertTriangle, Mic, Send, Pin, MicOff, MoreVertical } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Message {
  id: string
  sender: string
  role: string
  time: string
  text: string
  isPinned?: boolean
}

export const StaffComms: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState('ops-general')
  const [msg, setMsg] = useState('')
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Command Center', role: 'Admin', time: '14:02', text: 'All units, standard operations in effect.', isPinned: true },
    { id: '2', sender: 'Marcus Smith', role: 'Supervisor', time: '14:15', text: 'Gate C requires additional barriers.' },
    { id: '3', sender: 'Sarah Jenkins', role: 'Medical', time: '14:20', text: 'En route to Sector 104 for medical assist.' },
    { id: '4', sender: 'You', role: 'Staff', time: '14:22', text: 'Copy that. Area is clear.' },
  ])

  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'You',
      role: 'Staff',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: msg
    }])
    setMsg('')
  }

  // Simulate someone typing
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(true), 10000)
    const stopTimer = setTimeout(() => setIsTyping(false), 15000)
    return () => { clearTimeout(timer); clearTimeout(stopTimer) }
  }, [])

  return (
    <StaffLayout>
      <PageHeader title="Team Communication" subtitle="Live radio channels and instant messaging." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-200px)] min-h-[600px] mb-5">
        
        {/* Channels Sidebar */}
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <WidgetCard title="Channels" icon={Hash} iconColor="#475569" className="h-full">
            <div className="flex flex-col gap-1">
              <button onClick={() => setActiveChannel('emergency')} className={cn("flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left transition-colors", activeChannel === 'emergency' ? "bg-red-100 text-red-700 font-bold" : "text-[#475569] hover:bg-red-50 hover:text-red-700")}>
                <AlertTriangle className="w-4 h-4" /> Emergency
              </button>
              <button onClick={() => setActiveChannel('ops-general')} className={cn("flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-left transition-colors", activeChannel === 'ops-general' ? "bg-[#EFF6FF] text-[#1E40AF] font-bold" : "text-[#475569] hover:bg-[#F1F5F9]")}>
                <span className="flex items-center gap-2"><Hash className="w-4 h-4" /> ops-general</span>
                <span className="w-2 h-2 bg-[#2563EB] rounded-full" />
              </button>
              <button onClick={() => setActiveChannel('medical')} className={cn("flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left transition-colors", activeChannel === 'medical' ? "bg-[#EFF6FF] text-[#1E40AF] font-bold" : "text-[#475569] hover:bg-[#F1F5F9]")}>
                <Hash className="w-4 h-4" /> medical
              </button>
              <button onClick={() => setActiveChannel('security')} className={cn("flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-left transition-colors", activeChannel === 'security' ? "bg-[#EFF6FF] text-[#1E40AF] font-bold" : "text-[#475569] hover:bg-[#F1F5F9]")}>
                <Hash className="w-4 h-4" /> security
              </button>
            </div>

            <div className="mt-8">
              <h3 className="text-[12px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-2">Live Radio</h3>
              <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95", isMuted ? "bg-[#FEE2E2] text-[#DC2626]" : "bg-[#10B981] text-white")}
                >
                  {isMuted ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <div className="text-center">
                  <div className="text-[14px] font-bold text-[#0F172A]">Push to Talk</div>
                  <div className="text-[12px] text-[#64748B]">Hold spacebar to broadcast</div>
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Chat Area */}
        <div className="col-span-1 lg:col-span-9 flex flex-col bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden h-full">
          
          {/* Chat Header */}
          <div className="h-16 shrink-0 border-b border-[#E2E8F0] px-6 flex items-center justify-between bg-[#F8FAFC]">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-[#64748B]" />
              <div>
                <div className="font-bold text-[#0F172A]">#{activeChannel}</div>
                <div className="text-[12px] text-[#64748B]">24 participants • <span className="text-[#10B981]">12 online</span></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input type="text" placeholder="Search..." className="w-48 h-9 pl-9 pr-3 rounded-md border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB]" />
              </div>
              <button className="w-9 h-9 flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] rounded-md transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {messages.map(m => (
              <div key={m.id} className={cn("flex flex-col", m.sender === 'You' ? "items-end" : "items-start")}>
                
                {m.isPinned && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#D97706] bg-orange-50 px-2 py-0.5 rounded-md mb-1">
                    <Pin className="w-3 h-3" /> Pinned by Command
                  </div>
                )}
                
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[13px] font-bold text-[#0F172A]">{m.sender}</span>
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase">{m.role}</span>
                  <span className="text-[11px] text-[#94A3B8]">{m.time}</span>
                </div>
                
                <div className={cn("px-4 py-2.5 rounded-2xl max-w-[80%] text-[14px]", m.sender === 'You' ? "bg-[#2563EB] text-white rounded-tr-none" : "bg-[#F1F5F9] text-[#0F172A] rounded-tl-none")}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-[12px] text-[#64748B] italic">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-[#94A3B8] rounded-full animate-bounce delay-150" />
                </div>
                Marcus is typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#E2E8F0]">
            <form onSubmit={handleSend} className="flex gap-2">
              <input 
                type="text" 
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder={`Message #${activeChannel}...`}
                className="flex-1 h-12 px-4 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[14px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
              />
              <button 
                type="submit" 
                disabled={!msg.trim()}
                className="h-12 w-12 rounded-[8px] bg-[#2563EB] text-white flex items-center justify-center hover:bg-[#1D4ED8] disabled:opacity-50 disabled:grayscale transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </StaffLayout>
  )
}
