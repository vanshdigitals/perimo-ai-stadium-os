import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Bus, Car, TrainFront, Navigation, MapPinned } from 'lucide-react';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  Timeline,
  AIInsightsPanel,
  StatusPill,
  DataTable,
} from '@/components/widgets';
import type { TimelineEvent, AIInsight } from '@/components/widgets';

const PARKING_LOTS = [
  { lot: 'Lot A (North)', pct: 95 },
  { lot: 'Lot B (South)', pct: 80 },
  { lot: 'VIP Premium', pct: 65 },
  { lot: 'Staff Parking', pct: 50 },
];

const SHUTTLES = [
  { id: 'SH-01', route: 'Downtown Loop', eta: '3 min', occupancy: '42/50' },
  { id: 'SH-04', route: 'North Park & Ride', eta: '6 min', occupancy: '38/50' },
  { id: 'SH-07', route: 'Airport Express', eta: '11 min', occupancy: '20/50' },
  { id: 'SH-09', route: 'Downtown Loop', eta: '14 min', occupancy: '15/50' },
];

const ROADS = [
  { segment: 'I-95 Northbound (Exit 12)', status: 'Heavy', delay: '+18 min' },
  { segment: 'Stadium Way (Main Approach)', status: 'Moderate', delay: '+8 min' },
  { segment: 'Riverside Blvd', status: 'Clear', delay: 'On time' },
  { segment: 'Lot C Access Road', status: 'Moderate', delay: '+5 min' },
];

const ROAD_TONE: Record<string, 'danger' | 'warning' | 'success'> = { Heavy: 'danger', Moderate: 'warning', Clear: 'success' };

const TRANSIT_EVENTS: TimelineEvent[] = [
  { id: 'tr1', time: '21:10', title: 'Rail Station — Normal Operations', description: 'All lines running on schedule.', tone: 'success' },
  { id: 'tr2', time: '20:52', title: 'Shuttle SH-09 delayed 6 min', description: 'Traffic on Stadium Way main approach.', tone: 'warning' },
  { id: 'tr3', time: '20:40', title: 'VIP escort route confirmed', description: '3 vehicles en route via Gate VIP-2.', tone: 'info' },
  { id: 'tr4', time: '20:15', title: 'Lot A reached 95% capacity', description: 'Overflow signage activated.', tone: 'warning' },
];

const AI_INSIGHTS: AIInsight[] = [
  { id: 'tr-a1', title: 'Lot A will reach full capacity in ~12 minutes', detail: 'Recommend redirecting incoming traffic to Lot B via variable message signage now.', confidence: 87, classification: 'HIGH' },
  { id: 'tr-a2', title: 'Post-match shuttle demand forecast', detail: 'Expect 3,200 riders across all routes within 30 minutes of final whistle — pre-position 2 extra shuttles.', confidence: 79, classification: 'MEDIUM' },
];

export const Transportation: React.FC = () => (
  <AdminLayout>
    <PageHeader title="Transportation" subtitle="Inbound/outbound transit, parking capacity, and VIP routing." live />

    <StatusStrip
      items={[
        { label: 'General Parking', value: '84% full', tone: 'warning' },
        { label: 'Shuttle Arrivals', value: '12 in next 15m' },
        { label: 'Rail Station', value: 'Normal Operations' },
        { label: 'VIP Escorts', value: '3 en route' },
      ]}
    />

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="General Parking" value="84" unit="%" icon={Car} iconColor="#2563EB" delta={{ value: '+6% vs 30 min ago', direction: 'up', positive: false }} sparkline={[62, 68, 74, 78, 81, 83, 84]} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Shuttle Arrivals" value="12" unit="/15 min" icon={Bus} iconColor="#1FAA6D" delta={{ value: 'On schedule', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="Rail Status" value="Normal" icon={TrainFront} iconColor="#8B5CF6" delta={{ value: 'No delays reported', direction: 'flat' }} />
      </div>
      <div className="col-span-6 lg:col-span-3">
        <KPICard label="VIP Escorts" value="3" unit="en route" icon={Navigation} iconColor="#D68A00" delta={{ value: 'ETA 4–9 min', direction: 'flat' }} />
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5 mb-5">
      <div className="col-span-12 xl:col-span-6">
        <WidgetCard title="Live Traffic & Routing Map" icon={MapPinned} iconColor="#2563EB" live className="min-h-[380px]">
          <div className="h-full min-h-[300px] rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full opacity-70">
              <path d="M0,140 C60,120 100,160 150,130 C200,100 250,120 300,90" stroke="#C4291C" strokeWidth="3" fill="none" />
              <path d="M0,60 C80,80 140,40 220,60 C260,70 280,50 300,55" stroke="#D68A00" strokeWidth="3" fill="none" />
              <path d="M0,180 C100,190 200,175 300,185" stroke="#1FAA6D" strokeWidth="3" fill="none" />
            </svg>
            <div className="relative z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B] absolute bottom-3 left-3 flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C4291C]" /> Heavy</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D68A00]" /> Moderate</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1FAA6D]" /> Clear</span>
            </div>
          </div>
        </WidgetCard>
      </div>
      <div className="col-span-12 xl:col-span-6">
        <WidgetCard title="Parking Lot Capacities" icon={Car} iconColor="#2563EB" className="min-h-[380px]">
          <div className="flex flex-col gap-4">
            {PARKING_LOTS.map((lot) => (
              <div key={lot.lot}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="font-medium text-[#334155]">{lot.lot}</span>
                  <span className="text-[#64748B] font-mono">{lot.pct}%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${lot.pct}%`, backgroundColor: lot.pct > 90 ? '#C4291C' : lot.pct > 75 ? '#D68A00' : '#2563EB' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <AIInsightsPanel insights={AI_INSIGHTS} />
          </div>
        </WidgetCard>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 lg:col-span-5">
        <WidgetCard title="Shuttle Tracking" icon={Bus} iconColor="#1FAA6D" className="min-h-[280px]">
          <DataTable
            keyField={(r) => r.id}
            rows={SHUTTLES}
            columns={[
              { key: 'id', header: 'Unit', render: (r) => <span className="font-mono text-[#64748B]">{r.id}</span>, width: '70px' },
              { key: 'route', header: 'Route', render: (r) => r.route },
              { key: 'eta', header: 'ETA', render: (r) => <span className="font-mono">{r.eta}</span>, width: '70px' },
              { key: 'occupancy', header: 'Load', render: (r) => <span className="font-mono text-[#64748B]">{r.occupancy}</span>, width: '80px', align: 'right' },
            ]}
          />
        </WidgetCard>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <WidgetCard title="Road Congestion (ETA Analysis)" icon={Navigation} iconColor="#D68A00" className="min-h-[280px]">
          <div className="flex flex-col gap-2">
            {ROADS.map((r) => (
              <div key={r.segment} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium text-[#334155] truncate">{r.segment}</div>
                  <div className="text-[11px] text-[#94A3B8]">{r.delay}</div>
                </div>
                <StatusPill label={r.status} tone={ROAD_TONE[r.status]} />
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
      <div className="col-span-12 lg:col-span-3">
        <WidgetCard title="Public Transit" icon={TrainFront} iconColor="#8B5CF6" className="min-h-[280px]">
          <Timeline events={TRANSIT_EVENTS} />
        </WidgetCard>
      </div>
    </div>
  </AdminLayout>
);
