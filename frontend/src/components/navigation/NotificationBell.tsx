import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Check, Pin, X } from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { cn } from '@/utils/cn';

const NOTIFICATIONS = [
  { id: '1', type: 'critical', title: 'Medical Emergency', desc: 'Sector B Row 18. Medical team dispatched.', time: '2m ago', read: false },
  { id: '2', type: 'warning', title: 'High Density', desc: 'Gate C throughput below nominal. Consider rerouting.', time: '15m ago', read: false },
  { id: '3', type: 'info', title: 'Shift Change', desc: 'Security Team Alpha shift ending in 30 mins.', time: '1h ago', read: true },
  { id: '4', type: 'resolved', title: 'Network Latency', desc: 'Broadcast feed latency normalized.', time: '2h ago', read: true },
];

const ICONS = {
  critical: { icon: AlertTriangle, color: 'text-[#E5342B]', bg: 'bg-[#FEF2F2]' },
  warning: { icon: AlertCircle, color: 'text-[#D68A00]', bg: 'bg-[#FFFBEB]' },
  info: { icon: Info, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  resolved: { icon: CheckCircle2, color: 'text-[#1FAA6D]', bg: 'bg-[#F0FDF4]' },
};

export const NotificationCenter: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('notifications');
  const [activeTab, setActiveTab] = useState<'All' | 'Unread'>('All');
  
  const hasUnread = NOTIFICATIONS.some(n => !n.read);
  const displayNotifs = activeTab === 'Unread' ? NOTIFICATIONS.filter(n => !n.read) : NOTIFICATIONS;

  return (
    <div className="relative" ref={containerRef}>
      <button 
        onClick={toggle}
        className={cn(
          "relative w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          isOpen ? "bg-[#F1F5F9] text-[#0F172A]" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
        )}
        aria-expanded={isOpen}
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
        {hasUnread && (
          <>
            <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#EF4444] border-2 border-white z-10" />
            <span className="absolute top-[8px] right-[8px] w-[8px] h-[8px] rounded-full bg-[#EF4444] animate-ping" style={{ animationDuration: '3s' }} />
          </>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute top-[44px] right-0 w-[380px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] flex flex-col z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-semibold text-[#0F172A] text-[14px]">Notifications</h3>
            <button className="text-[12px] font-medium text-[#2563EB] hover:text-[#1E3A8A]">
              Mark all as read
            </button>
          </div>

          {/* Tabs */}
          <div className="flex px-4 border-b border-[#E2E8F0]">
            <button 
              onClick={() => setActiveTab('All')}
              className={cn("px-2 py-2.5 text-[13px] font-medium border-b-2 transition-colors", activeTab === 'All' ? "border-[#2563EB] text-[#0F172A]" : "border-transparent text-[#64748B] hover:text-[#0F172A]")}
            >
              All
            </button>
            <button 
              onClick={() => setActiveTab('Unread')}
              className={cn("px-2 py-2.5 ml-4 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5", activeTab === 'Unread' ? "border-[#2563EB] text-[#0F172A]" : "border-transparent text-[#64748B] hover:text-[#0F172A]")}
            >
              Unread
              <span className="bg-[#E2E8F0] text-[#475569] text-[10px] px-1.5 rounded-full">{NOTIFICATIONS.filter(n=>!n.read).length}</span>
            </button>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-none flex flex-col">
            {displayNotifs.map((n) => {
              const cfg = ICONS[n.type as keyof typeof ICONS];
              const Icon = cfg.icon;
              return (
                <div key={n.id} className={cn("p-4 border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors relative group", !n.read && "bg-[#F8FAFC]")}>
                  {!n.read && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563EB]" />}
                  <div className="flex gap-3">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", cfg.bg, cfg.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <span className={cn("text-[13px] font-semibold truncate", !n.read ? "text-[#0F172A]" : "text-[#475569]")}>{n.title}</span>
                        <span className="text-[11px] font-medium text-[#94A3B8] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[12px] text-[#64748B] leading-relaxed">{n.desc}</p>
                      
                      {/* Action buttons (appear on hover) */}
                      <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]" title="Mark as read">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]" title="Pin">
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1 rounded bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#E5342B] hover:bg-[#FEF2F2]" title="Dismiss">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
