import React from 'react';
import { SlidersHorizontal, ChevronDown, Radio, AlertTriangle, Users, Download, Bot, ShieldAlert, FileText, type LucideIcon } from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { cn } from '@/utils/cn';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  destructive?: boolean;
}

const ACTIONS: { group: string; items: QuickAction[] }[] = [
  { group: 'Operations', items: [
    { id: 'broadcast', label: 'Broadcast Alert', icon: Radio },
    { id: 'incident', label: 'Create Incident', icon: AlertTriangle },
    { id: 'deploy', label: 'Deploy Team', icon: Users },
  ]},
  { group: 'Intelligence', items: [
    { id: 'copilot', label: 'Open AI Copilot', icon: Bot },
    { id: 'sitrep', label: 'Generate Situation Report', icon: FileText },
    { id: 'export', label: 'Export Report', icon: Download },
  ]},
  { group: 'Emergency', items: [
    { id: 'lockdown', label: 'Emergency Lockdown', icon: ShieldAlert, destructive: true },
  ]},
];

export const QuickActions: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('quick-actions');

  return (
    <div className="relative hidden sm:block" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          "flex h-[36px] px-2.5 rounded-[8px] items-center gap-1.5 transition-colors duration-200 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
          isOpen ? "bg-[#F1F5F9] text-[#0F172A]" : "bg-white text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <SlidersHorizontal className="w-[15px] h-[15px]" strokeWidth={2.5} />
        <span className="text-[12px] font-medium whitespace-nowrap">Quick Actions</span>
        <ChevronDown className={cn("w-[14px] h-[14px] opacity-70 transition-transform duration-200", isOpen && "rotate-180")} strokeWidth={2} />
      </button>

      {isOpen && (
        <div 
          className="absolute top-[44px] right-0 w-[240px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] p-2 z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          role="menu"
        >
          {ACTIONS.map((section, idx) => (
            <div key={section.group} className={cn(idx > 0 && "mt-1.5 pt-1.5 border-t border-[#E2E8F0]")}>
              <div className="px-3 mb-1 mt-1">
                <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{section.group}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors outline-none",
                        item.destructive 
                          ? "text-[#E5342B] hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2]" 
                          : "text-[#334155] hover:bg-[#F1F5F9] focus-visible:bg-[#F1F5F9]"
                      )}
                      role="menuitem"
                      onClick={() => toggle()}
                    >
                      <Icon className={cn("w-4 h-4", item.destructive ? "text-[#E5342B]" : "text-[#64748B]")} strokeWidth={2} />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
