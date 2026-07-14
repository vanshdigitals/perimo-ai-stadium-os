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
} from '@/components/widgets';
import type { TimelineEvent, AIInsight } from '@/components/widgets';

interface Incident {
  id: string;
  title: string;
  location: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Responding' | 'Monitoring' | 'Resolved';
  assigned: string;
  age: string;
}

const INCIDENTS: Incident[] = [
  { id: 'INC-2041', title: 'Medical emergency — cardiac event', location: 'Sec B Row 18', severity: 'Critical', status: 'Responding', assigned: 'Medical Unit M-04', age: '4m' },
  { id: 'INC-2040', title: 'Gate C overflow / crowd crush risk', location: 'Gate C', severity: 'High', status: 'Open', assigned: 'Security Team Alpha', age: '9m' },
  { id: 'INC-2039', title: 'Parking Zone P2 capacity exceeded', location: 'Parking P2', severity: 'Medium', status: 'Monitoring', assigned: 'Transport Ops', age: '18m' },
  { id: 'INC-2038', title: 'Suspicious unattended bag', location: 'Concourse North', severity: 'High', status: 'Responding', assigned: 'K9 Unit Bravo', age: '22m' },
  { id: 'INC-2037', title: 'Broadcast feed latency spike', location: 'Control Room', severity: 'Low', status: 'Resolved', assigned: 'IT Operations', age: '1h' },
  { id: 'INC-2036', title: 'Minor slip-and-fall, no injury', location: 'Sector A Concourse', severity: 'Low', status: 'Resolved', assigned: 'First Aid Team', age: '2h' },
];

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

const RESPONSE_TIMELINE: TimelineEvent[] = [
  { id: 't1', time: '21:11', title: 'INC-2041 reported', description: 'Cardiac event flagged by section steward.', tone: 'danger' },
  { id: 't2', time: '21:12', title: 'Medical unit M-04 dispatched', description: 'ETA 90 seconds.', tone: 'warning' },
  { id: 't3', time: '21:14', title: 'On scene, treatment underway', tone: 'warning' },
  { id: 't4', time: '21:03', title: 'INC-2040 escalated to High', description: 'Crowd density crossed 90% threshold.', tone: 'warning' },
  { id: 't5', time: '20:58', title: 'INC-2039 auto-resolved by AI monitor', tone: 'success' },
];

const TEAMS = [
  { name: 'Medical Unit M-04', assigned: 'INC-2041', status: 'On scene' },
  { name: 'Security Team Alpha', assigned: 'INC-2040', status: 'En route' },
  { name: 'K9 Unit Bravo', assigned: 'INC-2038', status: 'On scene' },
  { name: 'Transport Ops', assigned: 'INC-2039', status: 'Monitoring' },
];

const ESCALATION_MATRIX = [
  { level: 'Level 1', trigger: 'Single unit response', authority: 'Shift Supervisor' },
  { level: 'Level 2', trigger: 'Multi-unit / crowd risk', authority: 'Operations Manager' },
  { level: 'Level 3', trigger: 'Life-safety event', authority: 'Venue Director + Emergency Services' },
];

const AI_INSIGHTS: AIInsight[] = [
  { id: 'i1', title: 'INC-2040 likely to escalate', detail: 'Gate C density trend suggests this incident may require a second response team within 5 minutes.', confidence: 85, classification: 'HIGH' },
  { id: 'i2', title: 'Pattern match: unattended bag incidents', detail: 'This is the 3rd unattended-item report in Concourse North this month — recommend signage review.', confidence: 68, classification: 'MEDIUM' },
];

export const IncidentCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = INCIDENTS.filter((inc) => {
    const matchesSearch = !search || inc.title.toLowerCase().includes(search.toLowerCase()) || inc.location.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || inc.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

  const openCount = INCIDENTS.filter((i) => i.status !== 'Resolved').length;

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
          { label: 'Critical', value: '1', tone: 'critical' },
          { label: 'Avg Response Time', value: '1m 45s' },
          { label: 'Teams Deployed', value: '4' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Open Incidents" value={String(openCount)} icon={Siren} iconColor="#C4291C" delta={{ value: '2 opened in last hour', direction: 'up', positive: false }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Response Time" value="1m 45s" icon={Clock} iconColor="#D68A00" delta={{ value: '-12s vs avg', direction: 'down', positive: true }} sparkline={[135, 128, 120, 112, 108, 105, 105]} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Teams Deployed" value="4" unit="/ 12" icon={Users} iconColor="#2563EB" delta={{ value: '8 available', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Escalations Today" value="2" icon={ShieldAlert} iconColor="#8B5CF6" delta={{ value: 'Both resolved within SLA', direction: 'flat' }} />
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
                { label: 'Critical', value: 1, color: '#C4291C' },
                { label: 'High', value: 2, color: '#D68A00' },
                { label: 'Medium', value: 1, color: '#2563EB' },
                { label: 'Low', value: 2, color: '#1FAA6D' },
              ]}
            />
            <div className="mt-5">
              <AIInsightsPanel insights={AI_INSIGHTS} />
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <WidgetCard title="Response Timeline" icon={Clock} iconColor="#2563EB" className="min-h-[280px]">
            <Timeline events={RESPONSE_TIMELINE} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Assigned Teams" icon={Users} iconColor="#1FAA6D" className="min-h-[280px]">
            <div className="flex flex-col gap-2">
              {TEAMS.map((t) => (
                <div key={t.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <div className="text-[13px] font-medium text-[#334155]">{t.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{t.assigned}</div>
                  </div>
                  <StatusPill label={t.status} tone={t.status === 'On scene' ? 'warning' : t.status === 'En route' ? 'info' : 'success'} />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <WidgetCard title="Escalation Matrix" icon={ShieldAlert} iconColor="#C4291C" className="min-h-[280px]">
            <div className="flex flex-col gap-3">
              {ESCALATION_MATRIX.map((e) => (
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
