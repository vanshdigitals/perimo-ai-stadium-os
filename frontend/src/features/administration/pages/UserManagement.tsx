import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { HeaderActionButton } from '@/components/ui/HeaderActionButton';
import { UserPlus, Users, ShieldCheck, Clock, UserX } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, DataTable, StatusPill, FilterBar } from '@/components/widgets';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'Global Admin' | 'Security Chief' | 'Staff Operator' | 'Volunteer';
  status: 'Active' | 'Away' | 'Suspended';
  lastActive: string;
}

const USERS: UserRow[] = [
  { id: 'u1', name: 'Sofia Ibrahim', email: 'sofia.ibrahim@perimo.io', role: 'Global Admin', status: 'Active', lastActive: 'Just now' },
  { id: 'u2', name: 'Alex Romero', email: 'alex.romero@perimo.io', role: 'Security Chief', status: 'Active', lastActive: '2 min ago' },
  { id: 'u3', name: 'Priya Nair', email: 'priya.nair@perimo.io', role: 'Staff Operator', status: 'Active', lastActive: '8 min ago' },
  { id: 'u4', name: 'Marcus Chen', email: 'marcus.chen@perimo.io', role: 'Staff Operator', status: 'Away', lastActive: '1 hour ago' },
  { id: 'u5', name: 'Daniela Cruz', email: 'daniela.cruz@perimo.io', role: 'Volunteer', status: 'Active', lastActive: '4 min ago' },
  { id: 'u6', name: 'Tomás Reyes', email: 'tomas.reyes@perimo.io', role: 'Staff Operator', status: 'Suspended', lastActive: '3 days ago' },
];

const STATUS_TONE: Record<UserRow['status'], 'success' | 'warning' | 'danger'> = { Active: 'success', Away: 'warning', Suspended: 'danger' };

export const UserManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  const filtered = USERS.filter((u) => {
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'all' || u.status.toLowerCase() === tab;
    return matchesSearch && matchesTab;
  });

  return (
    <AdminLayout>
      <PageHeader
        title="User Management"
        subtitle="Manage system access, active users, and staff accounts."
        actions={
          <HeaderActionButton label="Add User" icon={UserPlus} variant="primary" toastType="info" toastTitle="Invite a user" toastMessage="User invitations open here in the full release." />
        }
      />

      <StatusStrip
        items={[
          { label: 'Total Users', value: '42' },
          { label: 'Active Now', value: '31', tone: 'nominal' },
          { label: 'Away', value: '9', tone: 'warning' },
          { label: 'Suspended', value: '2', tone: 'critical' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Total Users" value="42" icon={Users} iconColor="#2563EB" delta={{ value: '+3 this month', direction: 'up', positive: true }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Active Sessions" value="31" icon={ShieldCheck} iconColor="#1FAA6D" delta={{ value: '74% of total', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Session Length" value="3.2" unit="hrs" icon={Clock} iconColor="#D68A00" delta={{ value: '+0.4 hrs vs last week', direction: 'up', positive: true }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Suspended Accounts" value="2" icon={UserX} iconColor="#C4291C" delta={{ value: 'Pending review', direction: 'flat' }} />
        </div>
      </div>

      <WidgetCard title="All Users" icon={Users} iconColor="#64748B">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users by name or email..."
          tabs={[
            { label: 'All', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Away', value: 'away' },
            { label: 'Suspended', value: 'suspended' },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />
        <DataTable
          keyField={(r) => r.id}
          rows={filtered}
          emptyLabel="No users match your filters."
          columns={[
            {
              key: 'name',
              header: 'User',
              render: (r) => (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[11px] font-semibold shrink-0">
                    {r.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-[#0F172A]">{r.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{r.email}</div>
                  </div>
                </div>
              ),
            },
            { key: 'role', header: 'Role', render: (r) => <StatusPill label={r.role} tone="neutral" />, width: '150px' },
            { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} dot />, width: '110px' },
            { key: 'lastActive', header: 'Last Active', render: (r) => <span className="text-[#64748B]">{r.lastActive}</span>, width: '120px' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
