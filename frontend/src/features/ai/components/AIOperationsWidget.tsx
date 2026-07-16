import React, { useEffect, useState } from 'react';
import { Brain, RefreshCw, AlertCircle, Expand, MoreVertical } from 'lucide-react';
import { useAIRecommendations } from '../hooks/useAIRecommendations';
import { useGeminiStatus } from '../hooks/useGeminiStatus';
import { RecommendationCard } from './RecommendationCard';
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';
import type { AIRecommendation } from '../types';
import { WidgetCard, WidgetHeaderButton } from '@/components/widgets/WidgetCard';

export const AIOperationsWidget: React.FC = () => {
  const { units, gates, thermal, crowdFlows } = useLiveUpdates();
  const context = { units, gates, thermal, crowdFlows };
  const { recommendations, isLoading, error, updateStatus, forceRefresh } = useAIRecommendations(context);
  const geminiStatus = useGeminiStatus();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations.length === 0) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !recommendations.some(r => r.id === selectedId)) {
      setSelectedId(recommendations[0].id);
    }
  }, [recommendations, selectedId]);

  const active: AIRecommendation | undefined = recommendations.find(r => r.id === selectedId);

  return (
    <WidgetCard
      title="AI Operations Copilot"
      icon={Brain}
      iconColor="#1652F0"
      live={!error}
      actions={
        <>
          <WidgetHeaderButton icon={RefreshCw} label="Refresh" onClick={forceRefresh} />
          <WidgetHeaderButton icon={Expand} label="Expand" onClick={() => {}} />
          <WidgetHeaderButton icon={MoreVertical} label="Menu" onClick={() => {}} />
        </>
      }
      className="h-full"
      bodyClassName="flex flex-col gap-3"
      newContentCount={recommendations.length > 3 ? recommendations.length - 3 : 0}
    >
      {/* Zone 1 — AI Status: persistent, not a transient toast. Shows failover
          copy when present, otherwise a steady "Online" read. */}
      <div className="flex items-center justify-between shrink-0 px-3 py-2 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              error ? 'bg-[#C4291C]' : geminiStatus ? 'bg-[#D68A00] animate-perimo-pulse' : 'bg-[#1FAA6D] animate-perimo-pulse'
            }`}
            aria-hidden="true"
          />
          <span className="text-[11px] font-medium text-[#475569] truncate">
            {geminiStatus || (error ? 'Copilot degraded' : 'Copilot online')}
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#94A3B8] shrink-0 tabular-nums">
          {active ? new Date(active.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
        </span>
      </div>

      {/* Zone 2 — Recommendation Queue: compact index, height-capped + scrollable
          so a long queue never grows this widget taller than the Digital Twin. */}
      {recommendations.length > 0 && (
        <div className="shrink-0">
          <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.06em] mb-1.5 px-0.5">
            Queue ({recommendations.length})
          </div>
          <div className="max-h-[168px] overflow-y-auto flex flex-col gap-1 pr-1 -mr-1">
            {recommendations.map(rec => (
              <button
                key={rec.id}
                onClick={() => setSelectedId(rec.id)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-left transition-colors cursor-pointer ${
                  rec.id === selectedId
                    ? 'bg-[#EFF6FF] border border-[#2563EB]/25'
                    : 'border border-transparent hover:bg-[#F8FAFC]'
                } ${rec.status !== 'PENDING' ? 'opacity-50' : ''}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    rec.classification === 'CRITICAL' ? 'bg-[#C4291C]' :
                    rec.classification === 'HIGH' ? 'bg-[#D68A00]' :
                    rec.classification === 'MEDIUM' ? 'bg-[#1FAA6D]' : 'bg-[#94A3B8]'
                  }`}
                  aria-hidden="true"
                />
                <span className="text-[12px] font-medium text-[#0F172A] truncate flex-1">{rec.title}</span>
                <span className="text-[10px] font-mono text-[#94A3B8] shrink-0 tabular-nums">{rec.confidence}%</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zone 3 — Active Recommendation: full detail + approve/reject for the
          selected queue item. flex-1 + min-h-0 + overflow-y-auto lets it fill
          whatever space remains without ever expanding the widget itself. */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
        {error && !isLoading && recommendations.length === 0 && (
          <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[10px] p-4 flex flex-col items-center justify-center text-center h-full min-h-[160px]">
            <AlertCircle className="w-8 h-8 text-[#EF4444] mb-2 opacity-80" />
            <p className="text-[13px] font-medium text-[#991B1B]">{error}</p>
            <button onClick={forceRefresh} className="mt-3 text-[12px] font-semibold text-[#B91C1C] hover:underline cursor-pointer">Try Again</button>
          </div>
        )}

        {isLoading && recommendations.length === 0 && (
          <div className="p-4 border border-[#E2E8F0] rounded-[12px] bg-white">
            <div className="flex justify-between mb-3">
              <div className="w-20 h-4 bg-[#F1F5F9] rounded animate-pulse" />
              <div className="w-12 h-3 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
            <div className="w-3/4 h-5 bg-[#F1F5F9] rounded mb-2 animate-pulse" />
            <div className="w-full h-10 bg-[#F1F5F9] rounded mb-4 animate-pulse" />
            <div className="w-full h-16 bg-[#F8FAFC] rounded animate-pulse" />
          </div>
        )}

        {!isLoading && !error && recommendations.length === 0 && (
          <div className="bg-[#F8FAFC] rounded-[10px] border border-[#E2E8F0] flex flex-col items-center justify-center h-full min-h-[160px] p-6 text-center">
            <Brain className="w-8 h-8 text-[#9AA3B2] mb-3 opacity-50" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-[#5B6472]">
              System monitoring active.<br />No critical operational recommendations at this time.
            </span>
          </div>
        )}

        {active && (
          <>
            <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.06em] mb-1.5 px-0.5">
              Active Recommendation
            </div>
            <RecommendationCard
              key={active.id}
              recommendation={active}
              onUpdateStatus={updateStatus}
              defaultExpanded
            />
          </>
        )}
      </div>
    </WidgetCard>
  );
};
