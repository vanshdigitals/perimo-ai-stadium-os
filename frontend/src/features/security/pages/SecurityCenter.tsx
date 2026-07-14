import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Cctv, ScanFace, LockKeyhole, Users, ShieldAlert, DoorClosed } from 'lucide-react';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  Timeline,
  StatusPill,
  DataTable,
  AIInsightsPanel,
} from '@/components/widgets';
import type { TimelineEvent, AIInsight } from '@/components/widgets';

const CAMERA_ZONES = [
  { zone: 'Gate Entrances', total: 48, online: 48 },
  { zone: 'Concourse Levels', total: 96, online: 95 },
  { zone: 'Seating Bowl', total: 72, online: 72 },
  { zone: 'Parking Structures', total: 28, online: 27 },
  { zone: 'VIP & Restricted', total: 12, online: 12 },
];

const THREAT_EVENTS: TimelineEvent[] = [
  { id: 'th1', time: '21:09', title: 'Banned individual match — 98% confidence', description: 'Detected at Gate 4 turnstile via facial recognition.', tone: 'danger' },
  { id: 'th2', time: '20:50', title: 'VIP arrival confirmed — 100% match', description: 'Premium Entrance, cleared for entry.', tone: 'success' },
  { id: 'th3', time: '20:22', title: 'Unattended bag flagged', description: 'Concourse North, K9 unit dispatched for sweep.', tone: 'warning' },
  { id: 'th4', time: '19:45', title: 'Perimeter breach sensor test — passed', description: 'Scheduled integrity check, all sensors nominal.', tone: 'info' },
];

const PATROLS = [
  { unit: 'Foot Patrol 1', zone: 'Concourse North', status: 'On patrol' },
  { unit: 'Foot Patrol 2', zone: 'Concourse South', status: 'On patrol' },
  { unit: 'K9 Unit Bravo', zone: 'Concourse North', status: 'Responding' },
  { unit: 'Mobile Unit 4', zone: 'Parking Structure B', status: 'On patrol' },
  { unit: 'QRF Alpha', zone: 'Command Post', status: 'Standby' },
];

const PATROL_TONE: Record<string, 'success' | 'warning' | 'info'> = { 'On patrol': 'success', Responding: 'warning', Standby: 'info' };

interface AccessRow {
  id: string;
  point: string;
  area: string;
  attempts: number;
  denied: number;
}

const ACCESS_LOG: AccessRow[] = [
  { id: 'ac1', point: 'VIP Entrance 2', area: 'VIP Level', attempts: 214, denied: 1 },
  { id: 'ac2', point: 'Staff Gate 7', area: 'Back of House', attempts: 348, denied: 4 },
  { id: 'ac3', point: 'Media Center Door', area: 'Press Level', attempts: 96, denied: 0 },
  { id: 'ac4', point: 'Locker Room Corridor', area: 'Restricted', attempts: 58, denied: 2 },
];

const RESTRICTED_AREAS = [
  { area: 'Team Locker Rooms', status: 'Secured' as const },
  { area: 'Broadcast Control Room', status: 'Secured' as const },
  { area: 'VIP Ownership Suite', status: 'Secured' as const },
  { area: 'Field Access Tunnel', status: 'Monitored' as const },
];

const AREA_TONE = { Secured: 'success', Monitored: 'warning', Breached: 'danger' } as const;

const AI_INSIGHTS: AIInsight[] = [
  { id: 's1', title: 'Banned individual detected at Gate 4', detail: '98% facial recognition confidence. Security dispatched for verification and escort.', confidence: 98, classification: 'CRITICAL' },
  { id: 's2', title: 'Elevated foot traffic near Staff Gate 7', detail: 'Access attempts up 20% vs typical — consistent with shift change, no anomaly.', confidence: 74, classification: 'INFO' },
];

export const SecurityCenter: React.FC = () => (
  <AdminLayout>
    <PageHeader title="Security Center" subtitle="CCTV coverage, facial recognition, access control, and threat detection." live />

    <StatusStrip
      items={[
        { label: 'Camera Network', value: '254 / 256 online', tone: 'warning' },
        { label: 'Patrol Units', value: '5 deployed' },
        { label: 'Access Points', value: '18 monitored' },
        { label: 'Active Alerts', value: '1', tone: 'critical' },
      ]}
    />

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Camera Health" value="254" unit="/ 256" icon={Cctv} iconColor="#2563EB" delta={{ value: '2 offline — Lot B', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Patrol Units" value="5" unit="active" icon={Users} iconColor="#1FAA6D" delta={{ value: '1 responding', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Access Attempts" value="716" unit="today" icon={DoorClosed} iconColor="#8B5CF6" delta={{ value: '7 denied', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Threat Alerts" value="1" unit="active" icon={ShieldAlert} iconColor="#C4291C" delta={{ value: 'Gate 4 — under review', direction: 'flat' }} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-12 xl:col-span-8">
        <WidgetCard title="Camera Health by Zone" icon={Cctv} iconColor="#475569" live className="min-h-[300px]">
          <div className="flex flex-col gap-2.5">
            {CAMERA_ZONES.map((z) => {
              const pct = Math.round((z.online / z.total) * 100);
              return (
                <div key={z.zone} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-[#334155] w-[160px] shrink-0 truncate">{z.zone}</span>
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#1FAA6D' : '#D68A00' }} />
                  </div>
                  <span className="font-mono text-[12px] text-[#64748B] w-[56px] text-right shrink-0">
                    {z.online}/{z.total}
                  </span>
                </div>
              );
            })}
          </div>
        </WidgetCard>
      </div>
      <div className="col-span-12 xl:col-span-4">
        <WidgetCard title="Threat Detection" icon={ScanFace} iconColor="#8B5CF6" className="min-h-[300px]">
          <AIInsightsPanel insights={AI_INSIGHTS} />
        </WidgetCard>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-4">
        <WidgetCard title="Patrol Units" icon={Users} iconColor="#1FAA6D" className="min-h-[280px]">
          <div className="flex flex-col gap-2">
            {PATROLS.map((p) => (
              <div key={p.unit} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <div className="text-[13px] font-medium text-[#334155]">{p.unit}</div>
                  <div className="text-[11px] text-[#94A3B8]">{p.zone}</div>
                </div>
                <StatusPill label={p.status} tone={PATROL_TONE[p.status]} />
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
      <div className="col-span-12 lg:col-span-5">
        <WidgetCard title="Access Control Log" icon={LockKeyhole} iconColor="#2563EB" className="min-h-[280px]">
          <DataTable
            keyField={(r) => r.id}
            rows={ACCESS_LOG}
            columns={[
              { key: 'point', header: 'Access Point', render: (r) => <span className="font-medium text-[#0F172A]">{r.point}</span> },
              { key: 'area', header: 'Area', render: (r) => <span className="text-[#64748B]">{r.area}</span> },
              { key: 'attempts', header: 'Attempts', render: (r) => <span className="font-mono">{r.attempts}</span>, width: '80px', align: 'right' },
              { key: 'denied', header: 'Denied', render: (r) => <span className={`font-mono ${r.denied > 0 ? 'text-[#C4291C]' : 'text-[#94A3B8]'}`}>{r.denied}</span>, width: '70px', align: 'right' },
            ]}
          />
        </WidgetCard>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <WidgetCard title="Restricted Areas" icon={ShieldAlert} iconColor="#C4291C" className="min-h-[280px]">
          <div className="flex flex-col gap-2 mb-4">
            {RESTRICTED_AREAS.map((a) => (
              <div key={a.area} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[12px] font-medium text-[#334155] truncate">{a.area}</span>
                <StatusPill label={a.status} tone={AREA_TONE[a.status]} dot />
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>

    <div className="mt-5">
      <WidgetCard title="Recent Security Events" icon={ShieldAlert} iconColor="#64748B">
        <Timeline events={THREAT_EVENTS} />
      </WidgetCard>
    </div>
  </AdminLayout>
);
