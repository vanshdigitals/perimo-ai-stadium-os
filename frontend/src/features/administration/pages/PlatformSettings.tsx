import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Globe, Shield, Database, Webhook, Wifi, Server, Bell } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, StatusPill } from '@/components/widgets';

const NAV_ITEMS = [
  { label: 'General', icon: Globe },
  { label: 'Security & MFA', icon: Shield },
  { label: 'Data Retention', icon: Database },
  { label: 'Webhooks & Integrations', icon: Webhook },
];

const API_STATUS = [
  { name: 'Gemini AI API', status: 'Operational' as const },
  { name: 'Google Maps API', status: 'Degraded' as const },
  { name: 'WebSocket Feed', status: 'Operational' as const },
  { name: 'Weather Data Provider', status: 'Operational' as const },
];
const API_TONE = { Operational: 'success', Degraded: 'warning', Down: 'danger' } as const;

const NOTIFICATION_RULES = [
  { rule: 'Critical incidents → SMS + Email', enabled: true },
  { rule: 'Gate congestion > 90% → Dashboard alert', enabled: true },
  { rule: 'Sensor offline > 5 min → Email', enabled: true },
  { rule: 'Weekly maintenance digest → Email', enabled: false },
];

export const PlatformSettings: React.FC = () => {
  const [activeNav, setActiveNav] = useState(0);

  return (
    <AdminLayout>
      <PageHeader title="Platform Settings" subtitle="Global configuration for the PERIMO environment." />

      <StatusStrip items={[{ label: 'API Uptime', value: '99.94%' }, { label: 'Integrations', value: '4 connected' }, { label: 'Last Backup', value: '3h ago' }]} />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="API Uptime (30d)" value="99.94" unit="%" icon={Server} iconColor="#1FAA6D" delta={{ value: '1 degraded service', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Active Integrations" value="4" icon={Webhook} iconColor="#2563EB" delta={{ value: 'All webhooks healthy', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Data Retention" value="90" unit="days" icon={Database} iconColor="#8B5CF6" delta={{ value: 'Audit logs & telemetry', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Notification Rules" value="3" unit="/ 4 active" icon={Bell} iconColor="#D68A00" delta={{ value: '1 rule disabled', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(i)}
              className={`w-full text-left px-4 py-2.5 rounded-[8px] font-medium text-[13px] flex items-center gap-2 transition-colors ${
                activeNav === i ? 'bg-[#EFF6FF] text-[#1E40AF]' : 'hover:bg-[#F1F5F9] text-[#475569]'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-9 flex flex-col gap-5">
          <WidgetCard title={NAV_ITEMS[activeNav].label} icon={NAV_ITEMS[activeNav].icon} iconColor="#2563EB" className="min-h-[320px]">
            <div className="flex flex-col gap-6 max-w-[600px]">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#344055]">Platform Name</label>
                <input type="text" defaultValue="PERIMO AI Operating System" className="h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]" />
                <p className="text-[12px] text-[#94A3B8]">The name displayed on the login screen and emails.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-[#344055]">Timezone</label>
                <select className="h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB]">
                  <option>UTC (Coordinated Universal Time)</option>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-4 border border-[#E2E8F0] rounded-[10px]">
                <div>
                  <div className="text-[14px] font-semibold text-[#0F172A]">Maintenance Mode</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">Disable all non-admin access to the platform.</div>
                </div>
                <div className="w-10 h-6 bg-[#E2E8F0] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm" />
                </div>
              </div>
              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
                <button className="px-5 py-2 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors">Save Changes</button>
              </div>
            </div>
          </WidgetCard>

          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-12 md:col-span-6">
              <WidgetCard title="API Status" icon={Wifi} iconColor="#2563EB" className="min-h-[220px]">
                <div className="flex flex-col gap-2">
                  {API_STATUS.map((a) => (
                    <div key={a.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[13px] font-medium text-[#334155]">{a.name}</span>
                      <StatusPill label={a.status} tone={API_TONE[a.status]} dot />
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>
            <div className="col-span-12 md:col-span-6">
              <WidgetCard title="Notification Rules" icon={Bell} iconColor="#D68A00" className="min-h-[220px]">
                <div className="flex flex-col gap-2">
                  {NOTIFICATION_RULES.map((r) => (
                    <div key={r.rule} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[13px] font-medium text-[#334155]">{r.rule}</span>
                      <StatusPill label={r.enabled ? 'Enabled' : 'Disabled'} tone={r.enabled ? 'success' : 'neutral'} />
                    </div>
                  ))}
                </div>
              </WidgetCard>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
