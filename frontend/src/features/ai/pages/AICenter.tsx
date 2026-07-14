import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { BrainCircuit, Cpu, Sparkles, Target, History } from 'lucide-react';
import { AIOperationsWidget } from '@/features/ai/components/AIOperationsWidget';
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary';
import { PageHeader, StatusStrip, KPICard, WidgetCard, AreaLineChart, Timeline, StatusPill, DonutChart } from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';

const CONFIDENCE_TREND = [78, 81, 84, 82, 87, 89, 91];

const MODELS = [
  { name: 'Gemini 2.5 Flash (Primary)', role: 'Recommendation engine', status: 'Nominal' as const },
  { name: 'Gemini 2.5 Flash (Backup)', role: 'Failover', status: 'Nominal' as const },
  { name: 'Crowd Prediction Model', role: 'Congestion forecasting', status: 'Nominal' as const },
  { name: 'Anomaly Detection Model', role: 'Camera/sensor pattern match', status: 'Degraded' as const },
];
const MODEL_TONE = { Nominal: 'success', Degraded: 'warning', Offline: 'danger' } as const;

const DECISION_HISTORY: TimelineEvent[] = [
  { id: 'd1', time: '21:14', title: 'Recommendation approved — Open Gate C overflow lane', description: 'Approved by A. Romero, executed in 12s.', tone: 'success' },
  { id: 'd2', time: '20:58', title: 'Recommendation dismissed — Reroute shuttle line 3', description: 'Dismissed by M. Chen — manual routing preferred.', tone: 'neutral' },
  { id: 'd3', time: '20:41', title: 'Recommendation approved — Dispatch medical unit M-04', description: 'Auto-approved under standing protocol.', tone: 'success' },
  { id: 'd4', time: '20:12', title: 'Recommendation approved — Pre-position 2 shuttles', description: 'Approved by S. Ibrahim ahead of predicted demand spike.', tone: 'success' },
];

export const AICenter: React.FC = () => (
  <AdminLayout>
    <PageHeader title="AI Center" subtitle="Model health, prediction engine, and the AI Operations Copilot in one place." live />

    <StatusStrip
      items={[
        { label: 'Copilot Status', value: 'Online' },
        { label: 'Avg Confidence', value: '91%' },
        { label: 'Recommendations Today', value: '18' },
        { label: 'Approval Rate', value: '83%' },
      ]}
    />

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Avg Confidence" value="91" unit="%" icon={Target} iconColor="#2563EB" delta={{ value: '+3pt vs yesterday', direction: 'up', positive: true }} sparkline={CONFIDENCE_TREND} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Recommendations Today" value="18" icon={Sparkles} iconColor="#8B5CF6" delta={{ value: '15 approved, 3 dismissed', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Model Uptime" value="99.6" unit="%" icon={Cpu} iconColor="#1FAA6D" delta={{ value: 'Failover triggered twice today', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Avg Response Time" value="1.8" unit="s" icon={BrainCircuit} iconColor="#D68A00" delta={{ value: '-0.3s vs baseline', direction: 'down', positive: true }} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-12 xl:col-span-8">
        <WidgetErrorBoundary fallbackTitle="AI Copilot Unavailable">
          <div className="h-full min-h-[520px]">
            <AIOperationsWidget />
          </div>
        </WidgetErrorBoundary>
      </div>
      <div className="col-span-12 xl:col-span-4">
        <WidgetCard title="Model Health" icon={Cpu} iconColor="#475569" className="min-h-[520px]">
          <div className="flex flex-col gap-2 mb-6">
            {MODELS.map((m) => (
              <div key={m.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#334155] truncate">{m.name}</div>
                  <div className="text-[11px] text-[#94A3B8]">{m.role}</div>
                </div>
                <StatusPill label={m.status} tone={MODEL_TONE[m.status]} dot />
              </div>
            ))}
          </div>
          <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Recommendation Outcomes</h4>
          <DonutChart
            centerLabel="Today"
            centerValue="18"
            data={[
              { label: 'Approved', value: 15, color: '#1FAA6D' },
              { label: 'Dismissed', value: 3, color: '#94A3B8' },
            ]}
          />
        </WidgetCard>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-6">
        <WidgetCard title="Confidence Score Trend" icon={Target} iconColor="#2563EB" className="min-h-[260px]">
          <AreaLineChart data={CONFIDENCE_TREND} labels={['19:00', '', '', '', '', '', '21:15']} color="#2563EB" valueFormatter={(v) => `${v}%`} />
        </WidgetCard>
      </div>
      <div className="col-span-12 lg:col-span-6">
        <WidgetCard title="Decision History" icon={History} iconColor="#8B5CF6" className="min-h-[260px]">
          <Timeline events={DECISION_HISTORY} />
        </WidgetCard>
      </div>
    </div>
  </AdminLayout>
);
