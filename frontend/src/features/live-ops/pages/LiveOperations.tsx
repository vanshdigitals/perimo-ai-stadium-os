import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Radio, Power, Wifi, Thermometer, Droplets, Camera, Download, ChevronRight } from 'lucide-react';
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
} from '@/components/widgets';
import type { TimelineEvent, AIInsight } from '@/components/widgets';

const SYSTEMS = [
  { label: 'Power Grid', value: 'Nominal', icon: Power, tone: 'success' as const },
  { label: 'Network Backbone', value: '99.8% Uptime', icon: Wifi, tone: 'success' as const },
  { label: 'HVAC', value: '72°F Avg', icon: Thermometer, tone: 'success' as const },
  { label: 'Water Systems', value: 'Nominal', icon: Droplets, tone: 'success' as const },
  { label: 'Camera Network', value: '244 / 245 Online', icon: Camera, tone: 'warning' as const },
];

const CROWD_ZONES = [
  { label: 'Gate A', value: 62 },
  { label: 'Gate B', value: 48 },
  { label: 'Gate C', value: 92, highlight: true },
  { label: 'Gate D', value: 55 },
  { label: 'Concourse N', value: 71 },
  { label: 'Concourse S', value: 38 },
];

const EVENT_FEED: TimelineEvent[] = [
  { id: 'e1', time: '21:14:02', title: 'Gate C flow rate exceeded 90% capacity', description: 'AI flagged overflow risk; recommendation issued to Operations.', tone: 'danger' },
  { id: 'e2', time: '21:11:40', title: 'Medical team dispatched', description: 'Unit M-04 en route to Sec B Row 18.', tone: 'warning' },
  { id: 'e3', time: '21:08:15', title: 'Camera CAM-112 reconnected', description: 'Concourse South feed restored after 40s dropout.', tone: 'success' },
  { id: 'e4', time: '21:02:51', title: 'Shift handover completed', description: 'Night security shift (Team Bravo) signed in, 24 units.', tone: 'info' },
  { id: 'e5', time: '20:58:03', title: 'Parking Lot P2 reached 98% capacity', description: 'Overflow vehicles redirected to Lot P3.', tone: 'warning' },
  { id: 'e6', time: '20:47:19', title: 'Weather advisory cleared', description: 'Wind speed dropped below threshold; roof status normal.', tone: 'success' },
];

const OPERATOR_LOG: TimelineEvent[] = [
  { id: 'o1', time: '21:15', title: 'A. Romero acknowledged Gate C alert', tone: 'info' },
  { id: 'o2', time: '21:12', title: 'P. Nair dispatched medical unit M-04', tone: 'info' },
  { id: 'o3', time: '21:05', title: 'S. Ibrahim approved AI recommendation #482', tone: 'success' },
  { id: 'o4', time: '20:59', title: 'M. Chen rerouted shuttle line 3', tone: 'info' },
];

const AI_INSIGHTS: AIInsight[] = [
  { id: 'a1', title: 'Overflow risk at Gate C', detail: 'Crowd density trending toward 95%+ within 6 minutes. Recommend opening overflow lane 2.', confidence: 91, classification: 'CRITICAL' },
  { id: 'a2', title: 'Concourse South foot traffic easing', detail: 'Density down 12% since kickoff. No action required.', confidence: 84, classification: 'INFO' },
  { id: 'a3', title: 'Camera outage pattern detected', detail: 'CAM-112 has dropped 3 times this week around 21:00 — recommend maintenance ticket.', confidence: 77, classification: 'MEDIUM' },
];

interface EventRow {
  id: string;
  time: string;
  system: string;
  event: string;
  severity: 'Critical' | 'Warning' | 'Info' | 'Resolved';
}

const RECENT_EVENTS: EventRow[] = [
  { id: 'ev-1', time: '21:14:02', system: 'Crowd Intelligence', event: 'Gate C flow rate exceeded 90% capacity', severity: 'Critical' },
  { id: 'ev-2', time: '21:11:40', system: 'Medical', event: 'Medical team dispatched to Sec B Row 18', severity: 'Warning' },
  { id: 'ev-3', time: '21:08:15', system: 'Security', event: 'Camera CAM-112 reconnected', severity: 'Resolved' },
  { id: 'ev-4', time: '21:02:51', system: 'Personnel', event: 'Shift handover completed — Team Bravo', severity: 'Info' },
  { id: 'ev-5', time: '20:58:03', system: 'Transportation', event: 'Parking Lot P2 reached 98% capacity', severity: 'Warning' },
  { id: 'ev-6', time: '20:47:19', system: 'Facilities', event: 'Weather advisory cleared', severity: 'Resolved' },
  { id: 'ev-7', time: '20:31:07', system: 'Network', event: 'WebSocket latency spike (180ms) auto-recovered', severity: 'Resolved' },
];

const SEVERITY_TONE: Record<EventRow['severity'], 'danger' | 'warning' | 'info' | 'success'> = {
  Critical: 'danger',
  Warning: 'warning',
  Info: 'info',
  Resolved: 'success',
};

export const LiveOperations: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filteredEvents = RECENT_EVENTS.filter((e) => {
    const matchesSearch = !search || e.event.toLowerCase().includes(search.toLowerCase()) || e.system.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || e.severity.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

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

      <StatusStrip
        items={[
          { label: 'Match Status', value: 'In Progress — 68\'' },
          { label: 'Attendance', value: '81,414 (98%)' },
          { label: 'Active Incidents', value: '3', tone: 'warning' },
          { label: 'Operators On Duty', value: '42' },
          { label: 'Weather', value: '22°C Clear' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Gates Open" value="18" unit="/ 20" icon={Radio} iconColor="#2563EB" delta={{ value: '2 closed for maintenance', direction: 'flat' }} sparkline={[16, 17, 18, 18, 19, 18, 18]} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Wait Time" value="4.2" unit="min" icon={Radio} iconColor="#D68A00" delta={{ value: '-0.8 min vs last hour', direction: 'down', positive: true }} sparkline={[6, 5.8, 5.2, 4.9, 4.5, 4.3, 4.2]} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Crowd Density" value="68" unit="%" icon={Radio} iconColor="#8B5CF6" delta={{ value: '+6% vs 15 min ago', direction: 'up', positive: false }} sparkline={[52, 55, 58, 61, 64, 66, 68]} sparklineColor="#8B5CF6" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Active Cameras" value="244" unit="/ 245" icon={Radio} iconColor="#1FAA6D" delta={{ value: '1 offline — CAM-112', direction: 'flat' }} sparkline={[245, 245, 244, 245, 244, 244, 244]} sparklineColor="#1FAA6D" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Live Event Feed" icon={Radio} iconColor="#2563EB" live actions={<WidgetHeaderButton icon={ChevronRight} label="View all" />} className="min-h-[420px]">
            <div className="max-h-[360px] overflow-y-auto pr-1">
              <Timeline events={EVENT_FEED} />
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Stadium Health" icon={Power} iconColor="#1FAA6D" className="min-h-[420px]">
            <div className="flex flex-col gap-2">
              {SYSTEMS.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                    <s.icon className="w-4 h-4 text-[#64748B]" strokeWidth={2} />
                    {s.label}
                  </span>
                  <StatusPill label={s.value} tone={s.tone} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Crowd Overview" icon={Radio} iconColor="#8B5CF6" className="min-h-[300px]">
            <BarChart data={CROWD_ZONES} maxValue={100} highlightColor="#8B5CF6" valueFormatter={(v) => `${v}%`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="AI Recommendations" icon={Radio} iconColor="#2563EB" className="min-h-[300px]">
            <AIInsightsPanel insights={AI_INSIGHTS} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Operator Activity" icon={Radio} iconColor="#64748B" className="min-h-[300px]">
            <Timeline events={OPERATOR_LOG} />
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
        <DataTable
          keyField={(r) => r.id}
          rows={filteredEvents}
          emptyLabel="No events match your filters."
          columns={[
            { key: 'time', header: 'Time', render: (r) => <span className="font-mono text-[#64748B]">{r.time}</span>, width: '100px' },
            { key: 'system', header: 'System', render: (r) => r.system, width: '160px' },
            { key: 'event', header: 'Event', render: (r) => r.event },
            { key: 'severity', header: 'Status', render: (r) => <StatusPill label={r.severity} tone={SEVERITY_TONE[r.severity]} />, width: '110px' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
