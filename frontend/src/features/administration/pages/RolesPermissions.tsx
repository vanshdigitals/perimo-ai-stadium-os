import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { ShieldCheck, Plus, Users, Layers } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, DataTable } from '@/components/widgets';

interface RoleDef {
  id: string;
  name: string;
  description: string;
  users: number;
}

const ROLES: RoleDef[] = [
  { id: 'r1', name: 'Global Administrator', description: 'Full access to all system components and configurations.', users: 3 },
  { id: 'r2', name: 'Security Operator', description: 'Incident response, camera network, and access control.', users: 12 },
  { id: 'r3', name: 'Facilities Manager', description: 'HVAC, power, water, and maintenance operations.', users: 6 },
  { id: 'r4', name: 'Guest Services', description: 'Read-only access to crowd and gate widgets.', users: 15 },
  { id: 'r5', name: 'Executive Viewer', description: 'Analytics and reporting dashboards only.', users: 6 },
];

interface PermissionRow {
  module: string;
  view: boolean;
  edit: boolean;
  delete: boolean;
  admin: boolean;
}

const PERMISSIONS: PermissionRow[] = [
  { module: 'Command Center', view: true, edit: true, delete: true, admin: true },
  { module: 'Digital Twin', view: true, edit: true, delete: true, admin: true },
  { module: 'AI Operations', view: true, edit: true, delete: false, admin: true },
  { module: 'User Management', view: true, edit: true, delete: true, admin: true },
  { module: 'Platform Settings', view: true, edit: true, delete: false, admin: true },
];

export const RolesPermissions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);

  return (
    <AdminLayout>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Configure RBAC rules and per-module access."
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Custom Role
          </button>
        }
      />

      <StatusStrip
        items={[
          { label: 'Roles Defined', value: String(ROLES.length) },
          { label: 'Total Assignments', value: String(ROLES.reduce((s, r) => s + r.users, 0)) },
          { label: 'Custom Roles', value: '0' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-4">
          <KPICard label="Roles Defined" value={String(ROLES.length)} icon={ShieldCheck} iconColor="#2563EB" delta={{ value: 'All system-defined', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KPICard label="Total Assignments" value={String(ROLES.reduce((s, r) => s + r.users, 0))} icon={Users} iconColor="#1FAA6D" delta={{ value: 'Across 42 users', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-4">
          <KPICard label="Modules Governed" value="14" icon={Layers} iconColor="#8B5CF6" delta={{ value: 'Full platform coverage', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-3">
          {ROLES.map((role) => {
            const isActive = role.id === selectedRole.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className={`text-left p-4 border rounded-[12px] transition-colors cursor-pointer ${
                  isActive ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold text-[14px] ${isActive ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{role.name}</span>
                  <ShieldCheck className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`} />
                </div>
                <div className="text-[12px] text-[#64748B]">{role.description}</div>
                <div className="text-[11px] text-[#94A3B8] mt-2">{role.users} users assigned</div>
              </button>
            );
          })}
        </div>

        <div className="col-span-12 lg:col-span-8">
          <WidgetCard title={selectedRole.name} icon={ShieldCheck} iconColor="#2563EB" className="min-h-[400px]">
            <p className="text-[13px] text-[#64748B] -mt-2 mb-4">{selectedRole.users} users assigned · {selectedRole.description}</p>
            <DataTable
              keyField={(r) => r.module}
              rows={PERMISSIONS}
              columns={[
                { key: 'module', header: 'Module', render: (r) => <span className="font-medium text-[#0F172A]">{r.module}</span> },
                { key: 'view', header: 'View', render: (r) => <PermCheck on={r.view} />, width: '70px', align: 'center' },
                { key: 'edit', header: 'Edit', render: (r) => <PermCheck on={r.edit} />, width: '70px', align: 'center' },
                { key: 'delete', header: 'Delete', render: (r) => <PermCheck on={r.delete} />, width: '70px', align: 'center' },
                { key: 'admin', header: 'Admin', render: (r) => <PermCheck on={r.admin} />, width: '70px', align: 'center' },
              ]}
            />
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};

const PermCheck: React.FC<{ on: boolean }> = ({ on }) => (
  <span className={`inline-block w-4 h-4 rounded-[4px] ${on ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`} aria-label={on ? 'Enabled' : 'Disabled'} />
);
