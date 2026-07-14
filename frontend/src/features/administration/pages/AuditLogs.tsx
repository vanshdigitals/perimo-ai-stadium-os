import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Download, FileClock, ShieldCheck, Bot, UserCog } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, DataTable, StatusPill, FilterBar } from '@/components/widgets';

interface LogRow {
  id: string;
  time: string;
  eventId: string;
  actor: string;
  action: string;
  target: string;
  detail: string;
  type: 'Authentication' | 'AI Operations' | 'Configuration';
}

const LOGS: LogRow[] = [
  { id: 'l1', time: '2026-07-13 14:01:22', eventId: 'EVT-9912A', actor: 'PERIMO AI System', action: 'AUTO_SCALE_GATES', target: 'Gate_Cluster_4', detail: 'AI automatically opened overflow lane due to threshold.', type: 'AI Operations' },
  { id: 'l2', time: '2026-07-13 14:02:22', actor: 'john.doe@perimo.io', eventId: 'EVT-9922A', action: 'USER_LOGIN', target: 'Session', detail: 'Successful MFA login.', type: 'Authentication' },
  { id: 'l3', time: '2026-07-13 14:03:22', actor: 'sofia.ibrahim@perimo.io', eventId: 'EVT-9932A', action: 'ROLE_UPDATED', target: 'Security Chief', detail: 'Added camera network permissions.', type: 'Configuration' },
  { id: 'l4', time: '2026-07-13 14:04:22', actor: 'PERIMO AI System', eventId: 'EVT-9942A', action: 'RECOMMENDATION_APPROVED', target: 'INC-2041', detail: 'Medical dispatch recommendation auto-approved.', type: 'AI Operations' },
  { id: 'l5', time: '2026-07-13 14:05:22', actor: 'alex.romero@perimo.io', eventId: 'EVT-9952A', action: 'USER_LOGIN', target: 'Session', detail: 'Successful MFA login.', type: 'Authentication' },
  { id: 'l6', time: '2026-07-13 14:06:22', actor: 'marcus.chen@perimo.io', eventId: 'EVT-9962A', action: 'SETTINGS_CHANGED', target: 'Platform Settings', detail: 'Updated maintenance mode window.', type: 'Configuration' },
  { id: 'l7', time: '2026-07-13 14:07:22', actor: 'unknown@external.io', eventId: 'EVT-9972A', action: 'USER_LOGIN_FAILED', target: 'Session', detail: 'Failed login attempt — invalid credentials.', type: 'Authentication' },
];

const TYPE_TONE: Record<LogRow['type'], 'info' | 'neutral' | 'success'> = { Authentication: 'info', 'AI Operations': 'success', Configuration: 'neutral' };

export const AuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = LOGS.filter((l) => {
    const matchesSearch = !search || l.actor.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase()) || l.eventId.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || l.type.toLowerCase().replace(' ', '-') === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable ledger of all system actions, configurations, and AI decisions."
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        }
      />

      <StatusStrip items={[{ label: 'Events Today', value: String(LOGS.length * 18) }, { label: 'AI Actions', value: '64' }, { label: 'Failed Logins', value: '3', tone: 'warning' }]} />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Events Today" value={String(LOGS.length * 18)} icon={FileClock} iconColor="#64748B" delta={{ value: 'Across all modules', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="AI Actions" value="64" icon={Bot} iconColor="#8B5CF6" delta={{ value: '38% of total events', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Config Changes" value="12" icon={UserCog} iconColor="#2563EB" delta={{ value: 'By 5 administrators', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Failed Logins" value="3" icon={ShieldCheck} iconColor="#C4291C" delta={{ value: 'Flagged for review', direction: 'flat' }} />
        </div>
      </div>

      <WidgetCard title="Event Ledger" icon={FileClock} iconColor="#64748B">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by event ID, user, or action..."
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Auth', value: 'authentication' },
            { label: 'AI Ops', value: 'ai-operations' },
            { label: 'Config', value: 'configuration' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />
        <DataTable
          keyField={(r) => r.id}
          rows={filtered}
          emptyLabel="No log entries match your filters."
          columns={[
            { key: 'time', header: 'Timestamp (UTC)', render: (r) => <span className="font-mono text-[#64748B]">{r.time}</span>, width: '170px' },
            { key: 'eventId', header: 'Event ID', render: (r) => <span className="font-mono text-[#3B82F6]">{r.eventId}</span>, width: '110px' },
            { key: 'actor', header: 'Actor', render: (r) => r.actor },
            { key: 'action', header: 'Action', render: (r) => <StatusPill label={r.action} tone="neutral" />, width: '170px' },
            { key: 'target', header: 'Target', render: (r) => <span className="text-[#64748B]">{r.target}</span> },
            { key: 'type', header: 'Type', render: (r) => <StatusPill label={r.type} tone={TYPE_TONE[r.type]} />, width: '120px' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
