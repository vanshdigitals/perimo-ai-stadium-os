import React from 'react';
import { Brain, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface AIInsight {
  id: string;
  title: string;
  detail: string;
  confidence: number;
  classification: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
}

const CLASS_STYLE: Record<AIInsight['classification'], { badge: string; icon: React.ElementType }> = {
  CRITICAL: { badge: 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]', icon: ShieldAlert },
  HIGH: { badge: 'bg-[#FFFBEB] text-[#92400E] border-[#FCD34D]', icon: AlertTriangle },
  MEDIUM: { badge: 'bg-[#F0FDF4] text-[#166534] border-[#86EFAC]', icon: Info },
  INFO: { badge: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]', icon: Info },
};

/** Read-only AI insight feed for module pages (distinct from the interactive
 *  AI Operations Copilot, which owns approve/reject workflows). Every module
 *  gets its own domain-specific insights through this one renderer. */
export const AIInsightsPanel: React.FC<{ insights: AIInsight[] }> = ({ insights }) => {
  if (insights.length === 0) {
    return <EmptyState icon={Brain} message="No AI insights at this time." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {insights.map((insight) => {
        const cfg = CLASS_STYLE[insight.classification];
        const Icon = cfg.icon;
        return (
          <div key={insight.id} className="p-3 border border-[#E2E8F0] rounded-[12px] hover:border-[#CBD5E1] hover:shadow-sm transition-all">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold border uppercase tracking-wide ${cfg.badge}`}>
                <Icon className="w-3 h-3" />
                {insight.classification}
              </span>
              <span className="text-[11px] font-medium text-[#64748B]">{insight.confidence}% confidence</span>
            </div>
            <h4 className="text-[13px] font-semibold text-[#0F172A] mb-1">{insight.title}</h4>
            <p className="text-[12px] text-[#64748B] leading-relaxed">{insight.detail}</p>
          </div>
        );
      })}
    </div>
  );
};
