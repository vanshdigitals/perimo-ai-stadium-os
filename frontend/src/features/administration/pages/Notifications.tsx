import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { BellRing, CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, FilterBar, StatusPill, EmptyState } from '@/components/widgets';

interface Notif {
  id: string;
  title: string;
  description: string;
  category: 'critical' | 'warning' | 'info' | 'resolved';
  time: string;
  action?: string;
}

const NOTIFICATIONS: Notif[] = [
  { id: 'n1', title: 'AI anomaly detected: unusually high flow at Gate C', description: 'Automated threshold triggered. Review the CCTV feed for Gate C to confirm.', category: 'critical', time: '2m ago', action: 'View Incident' },
  { id: 'n2', title: 'Medical team dispatched to Sec B Row 18', description: 'Unit M-04 responding to cardiac event report.', category: 'critical', time: '4m ago', action: 'View Incident' },
  { id: 'n3', title: 'Parking Lot P2 approaching capacity', description: 'Currently at 95% — overflow signage recommended.', category: 'warning', time: '18m ago' },
  { id: 'n4', title: 'Weekly maintenance report available', description: 'The automated weekly maintenance report for all facilities has been generated.', category: 'info', time: '1h ago' },
  { id: 'n5', title: 'Shift change — Security Team Alpha', description: 'Night shift signing in, 24 units confirmed on duty.', category: 'info', time: '1h ago' },
  { id: 'n6', title: 'Network latency spike normalized', description: 'Broadcast feed latency returned to baseline after brief spike.', category: 'resolved', time: '2h ago' },
];

const CATEGORY_CFG = {
  critical: { icon: AlertTriangle, color: '#C4291C', bg: '#FEF2F2', tone: 'danger' as const },
  warning: { icon: AlertTriangle, color: '#D68A00', bg: '#FFFBEB', tone: 'warning' as const },
  info: { icon: Info, color: '#2563EB', bg: '#EFF6FF', tone: 'info' as const },
  resolved: { icon: CheckCircle2, color: '#1FAA6D', bg: '#F0FDF4', tone: 'success' as const },
};

export const Notifications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = NOTIFICATIONS.filter((n) => {
    const matchesSearch = !search || n.title.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || n.category === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Notifications"
        subtitle="Review system alerts, broadcast messages, and platform notifications."
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark all as read
          </button>
        }
      />

      <StatusStrip
        items={[
          { label: 'Unread', value: '4', tone: 'warning' },
          { label: 'Critical', value: '2', tone: 'critical' },
          { label: 'Resolved Today', value: '11' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Unread" value="4" icon={Bell} iconColor="#2563EB" delta={{ value: 'Since last visit', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Critical" value="2" icon={AlertTriangle} iconColor="#C4291C" delta={{ value: 'Requires attention', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Warnings" value="1" icon={AlertTriangle} iconColor="#D68A00" delta={{ value: 'Monitoring', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Resolved Today" value="11" icon={CheckCircle2} iconColor="#1FAA6D" delta={{ value: '+3 vs yesterday', direction: 'up', positive: true }} />
        </div>
      </div>

      <WidgetCard title="All Notifications" icon={BellRing} iconColor="#64748B">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search notifications..."
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Critical', value: 'critical' },
            { label: 'Warning', value: 'warning' },
            { label: 'Info', value: 'info' },
            { label: 'Resolved', value: 'resolved' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />
        {filtered.length === 0 ? (
          <EmptyState icon={Bell} message="No notifications match your filters." />
        ) : (
          <div className="flex flex-col divide-y divide-[#E2E8F0]">
            {filtered.map((n) => {
              const cfg = CATEGORY_CFG[n.category];
              const Icon = cfg.icon;
              return (
                <div key={n.id} className="py-4 flex gap-3 first:pt-0 last:pb-0">
                  <div className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h4 className="text-[13px] font-semibold text-[#0F172A]">{n.title}</h4>
                      <span className="text-[11px] text-[#94A3B8] whitespace-nowrap font-mono">{n.time}</span>
                    </div>
                    <p className="text-[12px] text-[#64748B] leading-relaxed">{n.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusPill label={n.category} tone={cfg.tone} />
                      {n.action && (
                        <button className="text-[11px] font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors">{n.action}</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </WidgetCard>
    </AdminLayout>
  );
};
