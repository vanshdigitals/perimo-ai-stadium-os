import React, { useState } from 'react';
import { StaffLayout } from '@/components/layouts/StaffLayout';
import { AlertTriangle, Siren, ShieldAlert } from 'lucide-react';
import {
  PageHeader,
  StatusStrip,
  WidgetCard,
  DonutChart,
  DataTable,
  StatusPill,
  FilterBar,
  AIInsightsPanel,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets';
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

export const StaffIncidents: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const { data, loading, error, refetch } = useIncidents();

  if (loading && !data) {
    return (
      <StaffLayout>
        <PageHeader title="Active Incidents" subtitle="Triage and resolve your assigned incidents." live />
        <div className="grid grid-cols-12 gap-5 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="col-span-6 lg:col-span-3"><KPISkeleton /></div>
          ))}
        </div>
        <div className="grid grid-cols-12 gap-5 mb-5">
          <div className="col-span-12 xl:col-span-8"><WidgetCard title="Incident Queue" icon={Siren} iconColor="#C4291C" className="min-h-[420px]"><ChartSkeleton height={320} /></WidgetCard></div>
          <div className="col-span-12 xl:col-span-4"><WidgetCard title="Severity Distribution" className="min-h-[420px]"><ChartSkeleton height={320} /></WidgetCard></div>
        </div>
      </StaffLayout>
    );
  }

  if (error || !data) {
    return (
      <StaffLayout>
        <PageHeader title="Active Incidents" subtitle="Triage and resolve your assigned incidents." />
        <WidgetCard title="Active Incidents" icon={Siren} iconColor="#C4291C" className="min-h-[340px]">
          <ErrorState message={error?.message ?? 'Incident data is currently unavailable.'} onRetry={refetch} />
        </WidgetCard>
      </StaffLayout>
    );
  }

  const { incidents, insights, severity_distribution, summary } = data;
  const openCount = summary.open_count;

  const filtered = incidents.filter((inc) => {
    const matchesSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.location.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || inc.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });


  return (
    <StaffLayout>
      <PageHeader
        title="Active Incidents"
        subtitle="Triage and resolve your assigned incidents."
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
    </StaffLayout>
  );
};
