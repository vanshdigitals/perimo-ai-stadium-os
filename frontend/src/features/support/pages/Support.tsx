import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { HeaderActionButton } from '@/components/ui/HeaderActionButton';
import { LifeBuoy, Ticket, Clock, Star, Users, Plus } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, DataTable, StatusPill, FilterBar, DonutChart } from '@/components/widgets';

interface TicketRow {
  id: string;
  subject: string;
  requester: string;
  priority: 'Urgent' | 'High' | 'Normal';
  status: 'Open' | 'In Progress' | 'Resolved';
  age: string;
}

const TICKETS: TicketRow[] = [
  { id: 'TCK-501', subject: 'Camera feed CAM-112 dropping intermittently', requester: 'Security Ops', priority: 'High', status: 'In Progress', age: '25 min' },
  { id: 'TCK-500', subject: 'Cannot approve AI recommendation — button unresponsive', requester: 'A. Romero', priority: 'Urgent', status: 'Open', age: '8 min' },
  { id: 'TCK-499', subject: 'Request: add new volunteer role', requester: 'P. Nair', priority: 'Normal', status: 'Open', age: '2 hrs' },
  { id: 'TCK-498', subject: 'Export report failing for Analytics module', requester: 'M. Chen', priority: 'Normal', status: 'Resolved', age: '1 day' },
  { id: 'TCK-497', subject: 'Notification rules not saving', requester: 'S. Ibrahim', priority: 'High', status: 'Resolved', age: '1 day' },
];

const PRIORITY_TONE: Record<TicketRow['priority'], 'danger' | 'warning' | 'info'> = { Urgent: 'danger', High: 'warning', Normal: 'info' };
const STATUS_TONE: Record<TicketRow['status'], 'danger' | 'warning' | 'success'> = { Open: 'danger', 'In Progress': 'warning', Resolved: 'success' };

const TEAM = [
  { name: 'Level 1 Support', online: 6, status: 'Available' as const },
  { name: 'Level 2 Engineering', online: 2, status: 'Available' as const },
  { name: 'On-call Escalation', online: 1, status: 'Standby' as const },
];

export const Support: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = TICKETS.filter((t) => {
    const matchesSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || t.status.toLowerCase().replace(' ', '-') === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Support"
        subtitle="Ticket queue, SLA compliance, and support team availability."
        actions={
          <HeaderActionButton label="New Ticket" icon={Plus} variant="primary" toastType="info" toastTitle="New support ticket" toastMessage="Ticket creation opens here in the full release." />
        }
      />

      <StatusStrip items={[{ label: 'Open Tickets', value: '2', tone: 'warning' }, { label: 'SLA Compliance', value: '96%' }, { label: 'Team Online', value: '9' }]} />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Open Tickets" value="2" icon={Ticket} iconColor="#C4291C" delta={{ value: '1 urgent', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Resolution Time" value="2.4" unit="hrs" icon={Clock} iconColor="#D68A00" delta={{ value: '-0.3 hrs vs last week', direction: 'down', positive: true }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="SLA Compliance" value="96" unit="%" icon={LifeBuoy} iconColor="#1FAA6D" delta={{ value: 'Target: 95%', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Satisfaction Score" value="4.6" unit="/5" icon={Star} iconColor="#8B5CF6" delta={{ value: 'From 64 tickets', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Ticket Queue" icon={Ticket} iconColor="#C4291C" live className="min-h-[380px]">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search tickets..."
              tabs={[
                { label: 'All', value: 'all' },
                { label: 'Open', value: 'open' },
                { label: 'In Progress', value: 'in-progress' },
                { label: 'Resolved', value: 'resolved' },
              ]}
              activeTab={tab}
              onTabChange={setTab}
            />
            <DataTable
              keyField={(r) => r.id}
              rows={filtered}
              emptyLabel="No tickets match your filters."
              columns={[
                { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-[#64748B]">{r.id}</span>, width: '90px' },
                {
                  key: 'subject',
                  header: 'Subject',
                  render: (r) => (
                    <div>
                      <div className="font-medium text-[#0F172A]">{r.subject}</div>
                      <div className="text-[11px] text-[#94A3B8]">{r.requester}</div>
                    </div>
                  ),
                },
                { key: 'priority', header: 'Priority', render: (r) => <StatusPill label={r.priority} tone={PRIORITY_TONE[r.priority]} />, width: '90px' },
                { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} />, width: '110px' },
                { key: 'age', header: 'Age', render: (r) => <span className="font-mono text-[#64748B]">{r.age}</span>, width: '70px', align: 'right' },
              ]}
            />
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <WidgetCard title="SLA Status" icon={Clock} iconColor="#D68A00" className="min-h-[180px]">
            <DonutChart
              centerLabel="Compliance"
              centerValue="96%"
              data={[
                { label: 'Within SLA', value: 96, color: '#1FAA6D' },
                { label: 'Breached', value: 4, color: '#C4291C' },
              ]}
            />
          </WidgetCard>
          <WidgetCard title="Support Team" icon={Users} iconColor="#2563EB" className="min-h-[180px]">
            <div className="flex flex-col gap-2">
              {TEAM.map((t) => (
                <div key={t.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <div className="text-[13px] font-medium text-[#334155]">{t.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{t.online} online</div>
                  </div>
                  <StatusPill label={t.status} tone={t.status === 'Available' ? 'success' : 'warning'} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
