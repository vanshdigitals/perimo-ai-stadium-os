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
} from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';

const POWER_TREND = [38, 40, 41, 42.5, 43, 42.8, 42.5];
const WATER_STATUS = [
  { system: 'Domestic Supply', status: 'Nominal' as const },
  { system: 'Fire Suppression', status: 'Nominal' as const },
  { system: 'Irrigation (Pitch)', status: 'Nominal' as const },
  { system: 'Grey Water Recycling', status: 'Degraded' as const },
];
const TONE = { Nominal: 'success', Degraded: 'warning', Offline: 'danger' } as const;

interface MaintReq {
  id: string;
  location: string;
  issue: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Queued' | 'Dispatched' | 'Resolved';
}

const MAINTENANCE: MaintReq[] = [
  { id: 'REQ-001', location: 'Sector 1 Restrooms', issue: 'Plumbing maintenance required', priority: 'Medium', status: 'Dispatched' },
  { id: 'REQ-002', location: 'Sector 2 Restrooms', issue: 'Hand dryer unit offline', priority: 'Low', status: 'Queued' },
  { id: 'REQ-003', location: 'Concourse North', issue: 'Flickering light fixtures', priority: 'Low', status: 'Queued' },
  { id: 'REQ-004', location: 'VIP Kitchen', issue: 'Refrigeration unit temperature alarm', priority: 'High', status: 'Dispatched' },
  { id: 'REQ-005', location: 'Gate B Turnstiles', issue: 'Turnstile #4 jammed', priority: 'High', status: 'Resolved' },
];

const PRIORITY_TONE: Record<MaintReq['priority'], 'danger' | 'warning' | 'success'> = { High: 'danger', Medium: 'warning', Low: 'success' };
const STATUS_TONE: Record<MaintReq['status'], 'warning' | 'info' | 'success'> = { Queued: 'warning', Dispatched: 'info', Resolved: 'success' };

const CLEANING_SCHEDULE: TimelineEvent[] = [
  { id: 'cl1', time: '21:30', title: 'Concourse deep-clean — Level 1', description: 'Crew of 6, estimated 45 min.', tone: 'info' },
  { id: 'cl2', time: '22:15', title: 'Restroom service round — All sectors', tone: 'info' },
  { id: 'cl3', time: '20:45', title: 'Spill cleanup — Sector B Row 12', description: 'Completed by janitorial team 3.', tone: 'success' },
  { id: 'cl4', time: '19:30', title: 'Pre-match full venue sweep', description: 'Completed ahead of gates opening.', tone: 'success' },
];

export const Facilities: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = MAINTENANCE.filter((m) => {
    const matchesSearch = !search || m.location.toLowerCase().includes(search.toLowerCase()) || m.issue.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || m.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader title="Facilities" subtitle="HVAC, power grids, water systems, and physical infrastructure health." live />

      <StatusStrip
        items={[
          { label: 'Grid Load', value: '42.5 MW' },
          { label: 'Avg Core Temp', value: '72°F' },
          { label: 'Sanitation', value: 'All systems nominal' },
          { label: 'Open Maintenance', value: '3', tone: 'warning' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Grid Load" value="42.5" unit="MW" icon={Zap} iconColor="#D68A00" delta={{ value: '+1.2 MW vs baseline', direction: 'up', positive: false }} sparkline={POWER_TREND} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Core Temp" value="72" unit="°F" icon={Thermometer} iconColor="#C4291C" delta={{ value: 'Within target range', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Water Systems" value="3" unit="/ 4 nominal" icon={Droplet} iconColor="#2563EB" delta={{ value: 'Grey water degraded', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Maintenance Queue" value="3" unit="open" icon={Wrench} iconColor="#8B5CF6" delta={{ value: '1 high priority', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Power Load Trend" icon={Zap} iconColor="#D68A00" className="min-h-[260px]">
            <AreaLineChart data={POWER_TREND} labels={['18:00', '', '', '', '', '', '21:00']} color="#D68A00" valueFormatter={(v) => `${v} MW`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="HVAC Zones" icon={Thermometer} iconColor="#C4291C" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {['Seating Bowl', 'Concourse Levels', 'VIP Suites', 'Back of House'].map((zone, i) => (
                <div key={zone} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[13px] font-medium text-[#334155]">{zone}</span>
                  <span className="font-mono text-[13px] text-[#0F172A]">{70 + i}°F</span>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="Water Utility Status" icon={Droplet} iconColor="#2563EB" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {WATER_STATUS.map((w) => (
                <div key={w.system} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[13px] font-medium text-[#334155]">{w.system}</span>
                  <StatusPill label={w.status} tone={TONE[w.status]} dot />
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
            <Timeline events={CLEANING_SCHEDULE} />
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
