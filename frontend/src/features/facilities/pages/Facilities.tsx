import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Zap, Thermometer, Droplet, Wrench, Sparkles } from 'lucide-react';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  AreaLineChart,
  DataTable,
  StatusPill,
  FilterBar,
  Timeline,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
  RowsSkeleton,
} from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';
import { useFacilities } from '@/features/facilities/useFacilities';
import type {
  MaintenanceRequest,
  WaterStatusValue,
  CleaningEvent,
} from '@/features/facilities/api';

const WATER_TONE: Record<WaterStatusValue, 'success' | 'warning' | 'danger'> = {
  Nominal: 'success',
  Degraded: 'warning',
  Offline: 'danger',
};
const PRIORITY_TONE: Record<MaintenanceRequest['priority'], 'danger' | 'warning' | 'success'> = { High: 'danger', Medium: 'warning', Low: 'success' };
const STATUS_TONE: Record<MaintenanceRequest['status'], 'warning' | 'info' | 'success'> = { Queued: 'warning', Dispatched: 'info', Resolved: 'success' };
const CLEANING_TONE = new Set(['info', 'success', 'warning', 'danger']);

function toTimelineEvents(events: CleaningEvent[]): TimelineEvent[] {
  return events.map((e) => ({
    id: e.id,
    time: e.time,
    title: e.title,
    description: e.description ?? undefined,
    tone: (CLEANING_TONE.has(e.tone) ? e.tone : 'info') as TimelineEvent['tone'],
  }));
}

export const Facilities: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data, loading, error, refetch } = useFacilities();

  // --- Loading state ---
  if (loading && !data) {
    return (
      <AdminLayout>
        <PageHeader title="Facilities" subtitle="HVAC, power grids, water systems, and physical infrastructure health." live />
        <div className="grid grid-cols-12 gap-5 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-6 lg:col-span-3"><KPISkeleton /></div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-5 mb-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="col-span-12 xl:col-span-4">
              <WidgetCard title="Loading…" className="min-h-[260px]"><ChartSkeleton height={180} /></WidgetCard>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-8"><WidgetCard title="Maintenance Queue" icon={Wrench} iconColor="#8B5CF6" className="min-h-[340px]"><RowsSkeleton rows={5} /></WidgetCard></div>
          <div className="col-span-12 xl:col-span-4"><WidgetCard title="Cleaning Schedule" icon={Sparkles} iconColor="#1FAA6D" className="min-h-[340px]"><RowsSkeleton rows={4} /></WidgetCard></div>
        </div>
      </AdminLayout>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <AdminLayout>
        <PageHeader title="Facilities" subtitle="HVAC, power grids, water systems, and physical infrastructure health." />
        <WidgetCard title="Facilities" icon={Wrench} iconColor="#8B5CF6" className="min-h-[340px]">
          <ErrorState message={error?.message ?? 'Facilities data is currently unavailable.'} onRetry={refetch} />
        </WidgetCard>
      </AdminLayout>
    );
  }

  // --- Loaded: identical visuals, sourced from backend data ---
  const { power, hvac_zones, water_systems, maintenance, cleaning_schedule, summary } = data;
  const waterNominal = water_systems.filter((w) => w.status === 'Nominal').length;
  const degradedWater = water_systems.find((w) => w.status !== 'Nominal');
  const highPriorityOpen = maintenance.filter((m) => m.priority === 'High' && m.status !== 'Resolved').length;

  const filtered = maintenance.filter((m) => {
    const matchesSearch = !search || m.location.toLowerCase().includes(search.toLowerCase()) || m.issue.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || m.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader title="Facilities" subtitle="HVAC, power grids, water systems, and physical infrastructure health." live />

      <StatusStrip
        items={[
          { label: 'Grid Load', value: `${power.load_mw} MW` },
          { label: 'Avg Core Temp', value: `${summary.avg_core_temp_f}°F` },
          { label: 'Sanitation', value: summary.sanitation },
          { label: 'Open Maintenance', value: String(summary.open_maintenance), tone: 'warning' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Grid Load" value={String(power.load_mw)} unit="MW" icon={Zap} iconColor="#D68A00" delta={{ value: power.baseline_delta, direction: 'up', positive: false }} sparkline={power.trend} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Core Temp" value={String(summary.avg_core_temp_f)} unit="°F" icon={Thermometer} iconColor="#C4291C" delta={{ value: 'Within target range', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Water Systems" value={String(waterNominal)} unit={`/ ${water_systems.length} nominal`} icon={Droplet} iconColor="#2563EB" delta={{ value: degradedWater ? `${degradedWater.system} degraded` : 'All nominal', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Maintenance Queue" value={String(summary.open_maintenance)} unit="open" icon={Wrench} iconColor="#8B5CF6" delta={{ value: `${highPriorityOpen} high priority`, direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Power Load Trend" icon={Zap} iconColor="#D68A00" className="min-h-[260px]">
            <AreaLineChart data={power.trend} labels={power.labels} color="#D68A00" valueFormatter={(v) => `${v} MW`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="HVAC Zones" icon={Thermometer} iconColor="#C4291C" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {hvac_zones.map((z) => (
                <div key={z.zone} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[13px] font-medium text-[#334155]">{z.zone}</span>
                  <span className="font-mono text-[13px] text-[#0F172A]">{z.temp_f}°F</span>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Water Utility Status" icon={Droplet} iconColor="#2563EB" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {water_systems.map((w) => (
                <div key={w.system} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[13px] font-medium text-[#334155]">{w.system}</span>
                  <StatusPill label={w.status} tone={WATER_TONE[w.status]} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Maintenance Queue" icon={Wrench} iconColor="#8B5CF6" className="min-h-[340px]">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search requests..."
              tabs={[
                { label: 'All', value: 'all' },
                { label: 'Queued', value: 'queued' },
                { label: 'Dispatched', value: 'dispatched' },
                { label: 'Resolved', value: 'resolved' },
              ]}
              activeTab={tab}
              onTabChange={setTab}
            />
            <DataTable
              keyField={(r) => r.id}
              rows={filtered}
              emptyLabel="No maintenance requests match your filters."
              columns={[
                { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-[#64748B]">{r.id}</span>, width: '90px' },
                { key: 'location', header: 'Location', render: (r) => r.location },
                { key: 'issue', header: 'Issue', render: (r) => r.issue },
                { key: 'priority', header: 'Priority', render: (r) => <StatusPill label={r.priority} tone={PRIORITY_TONE[r.priority]} />, width: '100px' },
                { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} />, width: '110px' },
              ]}
            />
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Cleaning Schedule" icon={Sparkles} iconColor="#1FAA6D" className="min-h-[340px]">
            <Timeline events={toTimelineEvents(cleaning_schedule)} />
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
