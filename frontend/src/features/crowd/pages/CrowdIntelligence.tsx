import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { UsersRound, TrendingUp, MapPin, Flame, Download } from 'lucide-react';
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  AreaLineChart,
  DataTable,
  StatusPill,
  AIInsightsPanel,
  FilterBar,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets';
import { useCrowd } from '@/features/crowd/useCrowd';
import type { ZoneRow } from '@/features/crowd/api';

const STATUS_TONE: Record<ZoneRow['status'], 'success' | 'warning' | 'danger'> = {
  Nominal: 'success',
  Elevated: 'warning',
  Critical: 'danger',
};

export const CrowdIntelligence: React.FC = () => {
  const { gates } = useLiveUpdates();
  const [search, setSearch] = useState('');
  const { data, loading, error, refetch } = useCrowd();

  // --- Loading state ---
  if (loading && !data) {
    return (
      <AdminLayout>
        <PageHeader title="Crowd Intelligence" subtitle="Predictive density analysis, flow rates, and congestion forecasting." live />
        <div className="grid grid-cols-12 gap-5 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-6 lg:col-span-3"><KPISkeleton /></div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="col-span-12 xl:col-span-8"><WidgetCard title="Live Density Heatmap" className="min-h-[380px]"><ChartSkeleton height={300} /></WidgetCard></div>
          <div className="col-span-12 xl:col-span-4"><WidgetCard title="AI Congestion Prediction" className="min-h-[380px]"><ChartSkeleton height={300} /></WidgetCard></div>
        </div>
      </AdminLayout>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <AdminLayout>
        <PageHeader title="Crowd Intelligence" subtitle="Predictive density analysis, flow rates, and congestion forecasting." />
        <WidgetCard title="Crowd Intelligence" icon={Flame} iconColor="#C4291C" className="min-h-[340px]">
          <ErrorState message={error?.message ?? 'Crowd data is currently unavailable.'} onRetry={refetch} />
        </WidgetCard>
      </AdminLayout>
    );
  }

  // --- Loaded: identical visuals, sourced from backend ---
  const { zones, occupancy_trend, prediction_trend, flow_sparkline, insights, summary } = data;
  const filteredZones = zones.filter((z) => !search || z.zone.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <PageHeader
        title="Crowd Intelligence"
        subtitle="Predictive density analysis, flow rates, and congestion forecasting."
        live
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Snapshot
          </button>
        }
      />

      <StatusStrip
        items={[
          { label: 'Total Occupancy', value: summary.total_occupancy.toLocaleString() },
          { label: 'Projected Peak', value: summary.projected_peak },
          { label: 'Highest Density Zone', value: summary.highest_density_zone, tone: 'critical' },
          { label: 'Gates Tracked', value: String(gates.length || summary.gates_tracked) },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Total Occupancy" value={(summary.total_occupancy / 1000).toFixed(1)} unit="k" icon={UsersRound} iconColor="#8B5CF6" delta={{ value: '+4.2% vs last hour', direction: 'up', positive: false }} sparkline={occupancy_trend} sparklineColor="#8B5CF6" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Projected Peak" value="54.0" unit="k" icon={TrendingUp} iconColor="#D68A00" delta={{ value: 'Expected 19:30', direction: 'flat' }} sparkline={prediction_trend} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Congestion Zones" value={String(summary.congestion_critical)} unit="critical" icon={Flame} iconColor="#C4291C" delta={{ value: `${summary.congestion_elevated} elevated`, direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Flow Rate" value={String(summary.avg_flow_rate)} unit="ppl/min" icon={MapPin} iconColor="#2563EB" delta={{ value: summary.avg_flow_delta, direction: 'down', positive: true }} sparkline={flow_sparkline} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Live Density Heatmap" icon={Flame} iconColor="#C4291C" live className="min-h-[380px]">
            <div className="h-full min-h-[300px] rounded-[10px] bg-gradient-to-br from-[#EFF6FF] via-[#FEF3C7] to-[#FEE2E2] border border-[#E2E8F0] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #C4291C 0%, transparent 25%), radial-gradient(circle at 70% 60%, #D68A00 0%, transparent 30%), radial-gradient(circle at 50% 80%, #1FAA6D 0%, transparent 35%)' }} />
              <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-[8px] border border-[#E2E8F0] text-[12px] text-[#475569] font-medium">
                Zone-level thermal density — Gate C hotspot highlighted
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1FAA6D]" /> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D68A00]" /> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C4291C]" /> High</span>
              </div>
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="AI Congestion Prediction" icon={TrendingUp} iconColor="#2563EB" className="min-h-[380px]">
            <AIInsightsPanel insights={insights} />
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Occupancy Trend" icon={TrendingUp} iconColor="#8B5CF6" className="min-h-[260px]">
            <AreaLineChart data={occupancy_trend} labels={['19:00', '', '', '', '', '', '', '', '', '21:15']} color="#8B5CF6" valueFormatter={(v) => `${v}%`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Peak Analysis (Predicted)" icon={Flame} iconColor="#D68A00" className="min-h-[260px]">
            <AreaLineChart data={prediction_trend} labels={['19:00', '', '', '', '', '', '', '', '', '21:15']} color="#D68A00" valueFormatter={(v) => `${v}%`} />
          </WidgetCard>
        </div>
      </div>

      <WidgetCard title="Zone Density" icon={MapPin} iconColor="#64748B">
        <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search zones..." />
        <DataTable
          keyField={(r) => r.id}
          rows={filteredZones}
          emptyLabel="No zones match your search."
          columns={[
            { key: 'zone', header: 'Zone', render: (r) => <span className="font-medium text-[#0F172A]">{r.zone}</span> },
            {
              key: 'occupancy',
              header: 'Occupancy',
              render: (r) => (
                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, (r.occupancy / r.capacity) * 100)}%`, backgroundColor: STATUS_TONE[r.status] === 'danger' ? '#C4291C' : STATUS_TONE[r.status] === 'warning' ? '#D68A00' : '#1FAA6D' }}
                    />
                  </div>
                  <span className="font-mono text-[12px] text-[#64748B] shrink-0">
                    {r.occupancy.toLocaleString()}/{r.capacity.toLocaleString()}
                  </span>
                </div>
              ),
            },
            { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} />, width: '110px' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
