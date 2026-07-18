import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { HeaderActionButton } from '@/components/ui/HeaderActionButton';
import { Layers, Settings, Cpu, Camera, Truck, Route } from 'lucide-react';
import { DigitalTwinWidget } from '@/features/digital-twin/components/DigitalTwinWidget';
import { PageHeader, StatusStrip, WidgetCard, StatusPill, Timeline } from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';

const SENSORS = [
  { name: 'IoT Occupancy Sensors', count: '312 / 320', status: 'Nominal' as const },
  { name: 'Environmental Sensors', count: '48 / 48', status: 'Nominal' as const },
  { name: 'Structural Vibration', count: '16 / 16', status: 'Nominal' as const },
  { name: 'Air Quality Monitors', count: '22 / 24', status: 'Degraded' as const },
];

const SENSOR_TONE = { Nominal: 'success', Degraded: 'warning', Offline: 'danger' } as const;

const CAMERA_LAYERS = [
  { zone: 'Gate A–D Entrances', cams: 48, status: 'Online' },
  { zone: 'Concourse Levels 1–3', cams: 96, status: 'Online' },
  { zone: 'Seating Bowl', cams: 72, status: 'Online' },
  { zone: 'Parking Structures', cams: 28, status: '1 Offline' },
];

const ASSETS = [
  { id: 'AS-1', label: 'Security Unit 4', type: 'Patrol', floor: 'L1' },
  { id: 'AS-2', label: 'Medical Unit M-04', type: 'Medical', floor: 'L1' },
  { id: 'AS-3', label: 'Maintenance Cart 2', type: 'Maintenance', floor: 'P1' },
  { id: 'AS-4', label: 'K9 Unit Bravo', type: 'Security', floor: 'L2' },
];

const ROUTE_EVENTS: TimelineEvent[] = [
  { id: 'r1', time: '21:10', title: 'Emergency Route A verified clear', description: 'Gate A → North exit corridor, no obstructions.', tone: 'success' },
  { id: 'r2', time: '20:55', title: 'Route C rerouted around Gate C congestion', description: 'Temporary diversion via Concourse level 2.', tone: 'warning' },
  { id: 'r3', time: '20:40', title: 'All emergency routes re-validated', description: 'Scheduled twice-hourly integrity check passed.', tone: 'info' },
];

export const DigitalTwinOverview: React.FC = () => {
  return (
    <AdminLayout>
      <PageHeader
        title="Digital Twin"
        subtitle="Real-time spatial replica of the venue — sensors, assets, and cameras in one layer stack."
        live
        actions={
          <>
            <HeaderActionButton label="Layers" icon={Layers} toastType="info" toastTitle="Layer controls" toastMessage="Toggle sensor, asset and camera layers here in the full release." />
            <HeaderActionButton label="Settings" icon={Settings} toastType="info" toastTitle="Twin settings" toastMessage="Digital Twin display settings open here in the full release." />
          </>
        }
      />

      <StatusStrip
        items={[
          { label: 'Sensor Network', value: '398 / 408 online' },
          { label: 'Camera Overlay', value: '244 / 245 online', tone: 'warning' },
          { label: 'Tracked Assets', value: '4 active' },
          { label: 'Emergency Routes', value: 'All clear' },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <div className="bg-white border border-[#E2E8F0] rounded-[16px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.02)] h-full min-h-[560px]">
            <DigitalTwinWidget />
          </div>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <WidgetCard title="Sensor Status" icon={Cpu} iconColor="#2563EB" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {SENSORS.map((s) => (
                <div key={s.name} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <div className="text-[13px] font-medium text-[#334155]">{s.name}</div>
                    <div className="text-[11px] font-mono text-[#94A3B8]">{s.count}</div>
                  </div>
                  <StatusPill label={s.status} tone={SENSOR_TONE[s.status]} dot />
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Camera Overlay" icon={Camera} iconColor="#64748B" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {CAMERA_LAYERS.map((c) => (
                <div key={c.zone} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div>
                    <div className="text-[13px] font-medium text-[#334155]">{c.zone}</div>
                    <div className="text-[11px] text-[#94A3B8]">{c.cams} cameras</div>
                  </div>
                  <StatusPill label={c.status} tone={c.status === 'Online' ? 'success' : 'warning'} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Asset Tracking" icon={Truck} iconColor="#D68A00" className="min-h-[240px]">
            <div className="flex flex-col gap-2">
              {ASSETS.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#1FAA6D] animate-perimo-pulse shrink-0" />
                    <span className="text-[13px] font-medium text-[#334155]">{a.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill label={a.type} tone="neutral" />
                    <span className="text-[11px] font-mono text-[#94A3B8]">{a.floor}</span>
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Emergency Routes" icon={Route} iconColor="#C4291C" className="min-h-[240px]">
            <Timeline events={ROUTE_EVENTS} />
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
