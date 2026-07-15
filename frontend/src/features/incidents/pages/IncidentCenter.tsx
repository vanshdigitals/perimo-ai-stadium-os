import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { AlertTriangle, Siren, Users, Clock, ShieldAlert } from 'lucide-react';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  DonutChart,
  Timeline,
  DataTable,
  StatusPill,
  FilterBar,
  AIInsightsPanel,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';
import { useIncidents } from '@/features/incidents/useIncidents';
import type { Incident } from '@/features/incidents/api';

const SEVERITY_TONE: Record<Incident['severity'], 'danger' | 'warning' | 'info' | 'success'> = {
  Critical: 'danger',
  High: 'warning',
  Medium: 'info',
  Low: 'success',
};

const STATUS_TONE: Record<Incident['status'], 'danger' | 'warning' | 'info' | 'success'> = {
  Open: 'danger',
  Responding: 'warning',
  Monitoring: 'info',
  Resolved: 'success',
};

const TEAM_TONE = (status: string): 'warning' | 'info' | 'success' =>
  status === 'On scene' ? 'warning' : status === 'En route' ? 'info' : 'success';

export const IncidentCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data, loading, error, refetch } = useIncidents();

  // --- Loading state ---
  if (loading && !data) {
    return (
      <AdminLayout>
        <PageHeader title="Incident Center" subtitle="Triage, dispatch, and resolve venue incidents in one queue." live />
        <div className="grid grid-cols-12 gap-5 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-6 lg:col-span-3"><KPISkeleton /></div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="col-span-12 xl:col-span-8"><WidgetCard title="Incident Queue" icon={Siren} iconColor="#C4291C" className="min-h-[420px]"><ChartSkeleton height={320} /></WidgetCard></div>
          <div className="col-span-12 xl:col-span-4"><WidgetCard title="Severity Distribution" className="min-h-[420px]"><ChartSkeleton height={320} /></WidgetCard></div>
        </div>
      </AdminLayout>
    );
  }

  // --- Error state ---
  if (error || !data) {
    return (
      <AdminLayout>
        <PageHeader title="Incident Center" subtitle="Triage, dispatch, and resolve venue incidents in one queue." />
        <WidgetCard title="Incident Center" icon={Siren} iconColor="#C4291C" className="min-h-[340px]">
          <ErrorState message={error?.message ?? 'Incident data is currently unavailable.'} onRetry={refetch} />
        </WidgetCard>
      </AdminLayout>
    );
  }

  // --- Loaded ---
  const { incidents, teams, escalation_matrix, response_timeline, insights, severity_distribution, summary } = data;
  const openCount = summary.open_count;

  const filtered = incidents.filter((inc) => {
    const matchesSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.location.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || inc.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

  const timelineEvents: TimelineEvent[] = response_timeline.map((e) => ({
    id: e.id,
    time: e.time,
    title: e.title,
    description: e.description ?? undefined,
    tone: e.tone as TimelineEvent['tone'],
  }));

  return (
    <AdminLayout>
      <PageHeader
        title="Incident Center"
        subtitle="Triage, dispatch, and resolve venue incidents in one queue."
        live
        actions={
          <button className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px] hover:bg-[#1D4ED8] transition-colors flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" /> Report Incident
          </button>
        }
      />

      <StatusStrip
        items={[
          { label: 'Open Incidents', value: String(openCount), tone: 'warning' },
          { label: 'Critical', value: String(summary.critical_count), tone: 'critical' },
          { label: 'Avg Response Time', value: summary.avg_response_time },
          { label: 'Teams Deployed', value: String(summary.teams_deployed) },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Open Incidents" value={String(openCount)} icon={Siren} iconColor="#C4291C" delta={{ value: '2 opened in last hour', direction: 'up', positive: false }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Response Time" value={summary.avg_response_time} icon={Clock} iconColor="#D68A00" delta={{ value: '-12s vs avg', direction: 'down', positive: true }} sparkline={[135, 128, 120, 112, 108, 105, 105]} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Teams Deployed" value={String(summary.teams_deployed)} unit="/ 12" icon={Users} iconColor="#2563EB" delta={{ value: '8 available', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Escalations Today" value={String(summary.escalations_today)} icon={ShieldAlert} iconColor="#8B5CF6" delta={{ value: 'Both resolved within SLA', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Incident Queue" icon={Siren} iconColor="#C4291C" live className="min-h-[420px]">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search incidents..."
              tabs={[
                { label: 'All', value: 'all' },
                { label: 'Open', value: 'open' },
                { label: 'Responding', value: 'responding' },
                { label: 'Resolved', value: 'resolved' },
              ]}
              activeTab={tab}
              onTabChange={setTab}
            />
            <DataTable
              keyField={(r) => r.id}
              rows={filtered}
              emptyLabel="No incidents match your filters."
              columns={[
                { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-[#64748B]">{r.id}</span>, width: '90px' },
                {
                  key: 'title',
                  header: 'Incident',
                  render: (r) => (
                    <div>
                      <div className="font-medium text-[#0F172A]">{r.title}</div>
                      <div className="text-[11px] text-[#94A3B8]">{r.location} · {r.assigned}</div>
                    </div>
                  ),
                },
                { key: 'severity', header: 'Severity', render: (r) => <StatusPill label={r.severity} tone={SEVERITY_TONE[r.severity]} />, width: '100px' },
                { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} />, width: '110px' },
                { key: 'age', header: 'Age', render: (r) => <span className="font-mono text-[#64748B]">{r.age}</span>, width: '60px', align: 'right' },
              ]}
            />
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Severity Distribution" icon={ShieldAlert} iconColor="#64748B" className="min-h-[420px]">
            <DonutChart
              centerLabel="Active"
              centerValue={String(openCount)}
              data={[
                { label: 'Critical', value: severity_distribution.critical, color: '#C4291C' },
                { label: 'High', value: severity_distribution.high, color: '#D68A00' },
                { label: 'Medium', value: severity_distribution.medium, color: '#2563EB' },
                { label: 'Low', value: severity_distribution.low, color: '#1FAA6D' },
              ]}
            />
            <div className="mt-5">
              <AIInsightsPanel insights={insights} />
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <WidgetCard title="Response Timeline" icon={Clock} iconColor="#2563EB" className="min-h-[280px]">
            <Timeline events={timelineEvents} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Assigned Teams" icon={Users} iconColor="#1FAA6D" className="min-h-[280px]">
            <div className="flex flex-col gap-2">
              {teams.map((t) => (
                <div key={t.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <div className="text-[13px] font-medium text-[#334155]">{t.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{t.assigned}</div>
                  </div>
                  <StatusPill label={t.status} tone={TEAM_TONE(t.status)} />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <WidgetCard title="Escalation Matrix" icon={ShieldAlert} iconColor="#C4291C" className="min-h-[280px]">
            <div className="flex flex-col gap-3">
              {escalation_matrix.map((e) => (
                <div key={e.level} className="pb-3 border-b border-[#E2E8F0] last:border-0 last:pb-0">
                  <div className="text-[12px] font-semibold text-[#0F172A]">{e.level}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">{e.trigger}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">→ {e.authority}</div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
