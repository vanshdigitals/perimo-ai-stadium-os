import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { PageHeader, WidgetCard, KPICard, StatusPill } from '@/components/widgets';
import { useApp, WORKSPACES } from '@/contexts/AppContext';
import { Building2, Users, HardDrive, MapPin, Wifi, Server, Globe, Shield } from 'lucide-react';

const MEMBERS = [
  { name: 'Vansh', email: 'vansh@perimo.ai', role: 'Administrator', status: 'Online', initials: 'VG' },
  { name: 'Sofia Ibrahim', email: 'sofia.ibrahim@perimo.ai', role: 'Security Chief', status: 'Online', initials: 'SI' },
  { name: 'Marcus Chen', email: 'marcus.chen@perimo.ai', role: 'Operations Lead', status: 'Away', initials: 'MC' },
  { name: 'Alex Romero', email: 'alex.romero@perimo.ai', role: 'Medical Operator', status: 'Online', initials: 'AR' },
  { name: 'Priya Sharma', email: 'priya.sharma@perimo.ai', role: 'Transport Manager', status: 'Offline', initials: 'PS' },
];

const STATUS_TONE = { Online: 'success' as const, Away: 'warning' as const, Offline: 'neutral' as const };

const PERMISSIONS = [
  { name: 'Live Crowd Data Access', granted: true },
  { name: 'Incident Management', granted: true },
  { name: 'AI Copilot Full Access', granted: true },
  { name: 'Emergency Protocols', granted: true },
  { name: 'External API Access', granted: true },
  { name: 'Audit Log Export', granted: true },
];

const API_STATUS = [
  { name: 'Gemini AI API', status: 'Operational' as const, latency: '42ms' },
  { name: 'Google Maps API', status: 'Degraded' as const, latency: '310ms' },
  { name: 'WebSocket Feed', status: 'Operational' as const, latency: '8ms' },
  { name: 'Weather Provider', status: 'Operational' as const, latency: '120ms' },
];

const API_TONE = { Operational: 'success' as const, Degraded: 'warning' as const, Down: 'danger' as const };

export const WorkspacePage: React.FC = () => {
  const { activeWorkspace, switchWorkspace, toast } = useApp();

  return (
    <AdminLayout>
      <PageHeader
        title="Workspace"
        subtitle={`Managing workspace: ${activeWorkspace.name}`}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Team Members" value={String(MEMBERS.length)} icon={Users} iconColor="#2563EB" delta={{ value: '4 online now', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Storage Used" value={String(activeWorkspace.storageUsed)} unit="%" icon={HardDrive} iconColor="#8B5CF6" delta={{ value: `${activeWorkspace.storageUsed}GB of ${activeWorkspace.storageTotal}GB`, direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="API Uptime" value="99.94" unit="%" icon={Wifi} iconColor="#1FAA6D" delta={{ value: '30-day average', direction: 'up' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Region" value={activeWorkspace.region} icon={Globe} iconColor="#64748B" delta={{ value: 'Primary region', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Workspace Info */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          <WidgetCard title="Workspace Info" icon={Building2} iconColor="#2563EB">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-[10px] border border-[#E2E8F0]">
                <div className="w-12 h-12 rounded-[10px] bg-gradient-to-br from-[#0F172A] to-[#334155] flex items-center justify-center shadow-sm">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[14px] text-[#0F172A]">{activeWorkspace.name}</div>
                  <div className="text-[12px] text-[#1FAA6D] font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D]" />
                    {activeWorkspace.env}
                  </div>
                </div>
              </div>
              {[
                { label: 'Stadium', value: activeWorkspace.stadium, icon: MapPin },
                { label: 'Region', value: activeWorkspace.region, icon: Globe },
                { label: 'Environment', value: activeWorkspace.env, icon: Server },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
                    <row.icon className="w-3.5 h-3.5" /> {row.label}
                  </div>
                  <span className="text-[13px] font-medium text-[#0F172A]">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#64748B]">Storage</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${activeWorkspace.storageUsed}%` }} />
                  </div>
                  <span className="text-[12px] font-medium text-[#334155]">{activeWorkspace.storageUsed}%</span>
                </div>
              </div>
            </div>

            {/* Other workspaces */}
            <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
              <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Switch Workspace</div>
              <div className="flex flex-col gap-1">
                {WORKSPACES.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => { switchWorkspace(ws.id); toast({ type: 'success', title: 'Workspace Switched', message: ws.name }); }}
                    className={`flex items-center justify-between w-full px-2.5 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${ws.id === activeWorkspace.id ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'text-[#475569] hover:bg-[#F1F5F9]'}`}
                  >
                    {ws.name}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-[4px] font-medium ${ws.env === 'Production' ? 'bg-[#F0FDF4] text-[#1FAA6D]' : ws.env === 'Staging' ? 'bg-[#FFFBEB] text-[#D68A00]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
                      {ws.env}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Permissions" icon={Shield} iconColor="#8B5CF6">
            <div className="flex flex-col gap-2">
              {PERMISSIONS.map(p => (
                <div key={p.name} className="flex items-center justify-between px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px]">
                  <span className="text-[13px] text-[#334155]">{p.name}</span>
                  <StatusPill label={p.granted ? 'Granted' : 'Denied'} tone={p.granted ? 'success' : 'danger'} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Members & API */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          <WidgetCard title="Workspace Members" icon={Users} iconColor="#2563EB">
            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {MEMBERS.map(m => (
                <div key={m.email} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A]">{m.name}</div>
                    <div className="text-[12px] text-[#64748B]">{m.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#64748B] hidden sm:block">{m.role}</span>
                    <StatusPill label={m.status} tone={STATUS_TONE[m.status as keyof typeof STATUS_TONE]} dot />
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="API Status" icon={Wifi} iconColor="#1FAA6D">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {API_STATUS.map(a => (
                <div key={a.name} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#334155]">{a.name}</div>
                    <div className="text-[11px] text-[#94A3B8] font-mono">{a.latency}</div>
                  </div>
                  <StatusPill label={a.status} tone={API_TONE[a.status]} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
