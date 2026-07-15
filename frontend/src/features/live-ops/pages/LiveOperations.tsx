import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Radio, Power, Wifi, Thermometer, Droplets, Camera, Download, ChevronRight, RefreshCcw, Activity } from 'lucide-react';
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  WidgetHeaderButton,
  BarChart,
  Timeline,
  AIInsightsPanel,
  DataTable,
  StatusPill,
  FilterBar,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets';
import { useLiveOps } from '@/features/live-ops/useLiveOps';

const SYSTEM_ICONS: Record<string, React.ElementType> = {
  'Power Grid': Power,
  'Network Backbone': Wifi,
  'HVAC': Thermometer,
  'Water Systems': Droplets,
  'Camera Network': Camera,
};

const SEVERITY_TONE: Record<string, 'danger' | 'warning' | 'info' | 'success'> = {
  Critical: 'danger',
  Warning: 'warning',
  Info: 'info',
  Resolved: 'success',
};

export const LiveOperations: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const { data, isLoading, error } = useLiveOps();

  // Subscribe to liveops events
  useLiveUpdates();

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Live Operations" subtitle="Real-time command view across every stadium system." />
        <ErrorState message={error.message} onRetry={() => window.location.reload()} />
      </AdminLayout>
    );
  }

  const filteredEvents = data?.recent_events?.filter((e) => {
    const matchesSearch = !search || e.event?.toLowerCase().includes(search.toLowerCase()) || e.system?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || e.severity?.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  }) || [];

  return (
    <AdminLayout>
      <PageHeader
        title="Live Operations"
        subtitle="Real-time command view across every stadium system."
        live
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        }
      />

      {isLoading ? (
        <div className="flex items-center gap-3 mb-6 px-1">
          <RefreshCcw className="w-5 h-5 text-[#94A3B8] animate-spin" />
          <span className="text-[#64748B] text-sm">Loading live metrics...</span>
        </div>
      ) : (
        <StatusStrip
          items={[
            { label: 'Match Status', value: data?.summary.match_status! },
            { label: 'Attendance', value: data?.summary.attendance! },
            { label: 'Active Incidents', value: data?.summary.active_incidents.toString()!, tone: data?.summary.active_incidents! > 0 ? 'warning' : 'nominal' },
            { label: 'Operators On Duty', value: data?.summary.operators_on_duty.toString()! },
            { label: 'Weather', value: data?.summary.weather! },
          ]}
        />
      )}

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Gates Open" value={data?.summary.gates_open.toString()!} unit={`/ ${data?.summary.gates_total}`} icon={Radio} iconColor="#2563EB" delta={{ value: `${data?.summary.gates_total! - data?.summary.gates_open!} closed`, direction: 'flat' }} sparkline={[16, 17, 18, 18, 19, 18, data?.summary.gates_open!]} />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Avg Wait Time" value={data?.summary.avg_wait_time.toString()!} unit="min" icon={Radio} iconColor="#D68A00" delta={{ value: 'Live tracking', direction: 'flat' }} sparkline={[6, 5.8, 5.2, 4.9, 4.5, 4.3, data?.summary.avg_wait_time!]} sparklineColor="#D68A00" />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Crowd Density" value={data?.summary.crowd_density_pct.toString()!} unit="%" icon={Radio} iconColor="#8B5CF6" delta={{ value: 'Live tracking', direction: 'flat' }} sparkline={[52, 55, 58, 61, 64, 66, data?.summary.crowd_density_pct!]} sparklineColor="#8B5CF6" />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Active Cameras" value={data?.summary.active_cameras.toString()!} unit={`/ ${data?.summary.total_cameras}`} icon={Radio} iconColor="#1FAA6D" delta={{ value: `${data?.summary.total_cameras! - data?.summary.active_cameras!} offline`, direction: 'flat' }} sparkline={[245, 245, 244, 245, 244, 244, data?.summary.active_cameras!]} sparklineColor="#1FAA6D" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Live Event Feed" icon={Radio} iconColor="#2563EB" live actions={<WidgetHeaderButton icon={ChevronRight} label="View all" />} className="min-h-[420px]">
            {isLoading ? <ChartSkeleton height={360} /> : (
              <div className="max-h-[360px] overflow-y-auto pr-1">
                <Timeline events={data?.event_feed || []} />
              </div>
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Stadium Health" icon={Power} iconColor="#1FAA6D" className="min-h-[420px]">
            {isLoading ? <ChartSkeleton height={360} /> : (
              <div className="flex flex-col gap-2">
                {data?.systems.map((s) => {
                  const Icon = SYSTEM_ICONS[s.label] || Activity;
                  return (
                    <div key={s.label} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                        <Icon className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                        {s.label}
                      </span>
                      <StatusPill label={s.value} tone={s.tone} dot />
                    </div>
                  );
                })}
              </div>
            )}
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Crowd Overview" icon={Radio} iconColor="#8B5CF6" className="min-h-[300px]">
            {isLoading ? <ChartSkeleton height={240} /> : (
              <BarChart data={data?.crowd_zones || []} maxValue={100} highlightColor="#8B5CF6" valueFormatter={(v) => `${v}%`} />
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="AI Recommendations" icon={Radio} iconColor="#2563EB" className="min-h-[300px]">
            {isLoading ? <ChartSkeleton height={240} /> : (
              <AIInsightsPanel insights={data?.insights || []} />
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Operator Activity" icon={Radio} iconColor="#64748B" className="min-h-[300px]">
            {isLoading ? <ChartSkeleton height={240} /> : (
              <Timeline events={data?.operator_log || []} />
            )}
          </WidgetCard>
        </div>
      </div>

      <WidgetCard title="Recent Events" icon={Radio} iconColor="#64748B">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search events or systems..."
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Critical', value: 'critical' },
            { label: 'Warning', value: 'warning' },
            { label: 'Resolved', value: 'resolved' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />
        {isLoading ? <ChartSkeleton height={200} /> : (
          <DataTable
            keyField={(r) => r.id}
            rows={filteredEvents}
            emptyLabel="No events match your filters."
            columns={[
              { key: 'time', header: 'Time', render: (r) => <span className="font-mono text-[#64748B]">{r.time}</span>, width: '100px' },
              { key: 'system', header: 'System', render: (r) => r.system, width: '160px' },
              { key: 'event', header: 'Event', render: (r) => r.event },
              { key: 'severity', header: 'Status', render: (r) => <StatusPill label={r.severity || 'Info'} tone={SEVERITY_TONE[r.severity!] || 'info'} />, width: '110px' },
            ]}
          />
        )}
      </WidgetCard>
    </AdminLayout>
  );
};
