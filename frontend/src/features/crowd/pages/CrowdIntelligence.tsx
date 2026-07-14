import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { UsersRound, TrendingUp, MapPin, Flame, Download } from 'lucide-react';
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  AreaLineChart,
  DataTable,
  StatusPill,
  AIInsightsPanel,
  FilterBar,
} from '@/components/widgets';
import type { AIInsight } from '@/components/widgets';

const OCCUPANCY_TREND = [58, 61, 65, 70, 74, 79, 82, 78, 74, 68];
const PREDICTION_TREND = [68, 71, 76, 82, 88, 93, 95, 90, 84, 79];

interface ZoneRow {
  id: string;
  zone: string;
  occupancy: number;
  capacity: number;
  trend: 'up' | 'down' | 'flat';
  status: 'Nominal' | 'Elevated' | 'Critical';
}

const ZONES: ZoneRow[] = [
  { id: 'z1', zone: 'Gate A Concourse', occupancy: 3100, capacity: 5000, trend: 'flat', status: 'Nominal' },
  { id: 'z2', zone: 'Gate C Concourse', occupancy: 4620, capacity: 5000, trend: 'up', status: 'Critical' },
  { id: 'z3', zone: 'Sector A Seating', occupancy: 12480, capacity: 13000, trend: 'flat', status: 'Nominal' },
  { id: 'z4', zone: 'Sector B Seating', occupancy: 12100, capacity: 13000, trend: 'up', status: 'Elevated' },
  { id: 'z5', zone: 'North Concourse', occupancy: 2870, capacity: 4500, trend: 'down', status: 'Nominal' },
  { id: 'z6', zone: 'VIP Premium Level', occupancy: 980, capacity: 1200, trend: 'flat', status: 'Nominal' },
];

const STATUS_TONE: Record<ZoneRow['status'], 'success' | 'warning' | 'danger'> = {
  Nominal: 'success',
  Elevated: 'warning',
  Critical: 'danger',
};

const AI_INSIGHTS: AIInsight[] = [
  { id: 'c1', title: 'Gate C congestion predicted to peak at 95%', detail: 'Based on current ingress rate, Gate C concourse will hit critical density in ~8 minutes. Recommend early overflow routing.', confidence: 89, classification: 'CRITICAL' },
  { id: 'c2', title: 'Sector B trending toward elevated density', detail: 'Seating occupancy up 3% over the last 20 minutes — within normal halftime pattern.', confidence: 72, classification: 'MEDIUM' },
  { id: 'c3', title: 'North Concourse flow easing', detail: 'Density down 9% since last measurement. No action required.', confidence: 81, classification: 'INFO' },
];

export const CrowdIntelligence: React.FC = () => {
  const { gates } = useLiveUpdates();
  const [search, setSearch] = useState('');
  const totalOccupancy = ZONES.reduce((sum, z) => sum + z.occupancy, 0);

  const filteredZones = ZONES.filter((z) => !search || z.zone.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <PageHeader
        title="Crowd Intelligence"
        subtitle="Predictive density analysis, flow rates, and congestion forecasting."
        live
        actions={
          <button className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export Snapshot
          </button>
        }
      />

      <StatusStrip
        items={[
          { label: 'Total Occupancy', value: totalOccupancy.toLocaleString() },
          { label: 'Projected Peak', value: '54,000 at 19:30' },
          { label: 'Highest Density Zone', value: 'Gate C Concourse', tone: 'critical' },
          { label: 'Gates Tracked', value: String(gates.length || 3) },
        ]}
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Total Occupancy" value={(totalOccupancy / 1000).toFixed(1)} unit="k" icon={UsersRound} iconColor="#8B5CF6" delta={{ value: '+4.2% vs last hour', direction: 'up', positive: false }} sparkline={OCCUPANCY_TREND} sparklineColor="#8B5CF6" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Projected Peak" value="54.0" unit="k" icon={TrendingUp} iconColor="#D68A00" delta={{ value: 'Expected 19:30', direction: 'flat' }} sparkline={PREDICTION_TREND} sparklineColor="#D68A00" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Congestion Zones" value="1" unit="critical" icon={Flame} iconColor="#C4291C" delta={{ value: '2 elevated', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Flow Rate" value="186" unit="ppl/min" icon={MapPin} iconColor="#2563EB" delta={{ value: '-4% vs baseline', direction: 'down', positive: true }} sparkline={[210, 202, 195, 190, 188, 186, 186]} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Live Density Heatmap" icon={Flame} iconColor="#C4291C" live className="min-h-[380px]">
            <div className="h-full min-h-[300px] rounded-[10px] bg-gradient-to-br from-[#EFF6FF] via-[#FEF3C7] to-[#FEE2E2] border border-[#E2E8F0] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #C4291C 0%, transparent 25%), radial-gradient(circle at 70% 60%, #D68A00 0%, transparent 30%), radial-gradient(circle at 50% 80%, #1FAA6D 0%, transparent 35%)' }} />
              <div className="relative z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-[8px] border border-[#E2E8F0] text-[12px] text-[#475569] font-medium">
                Zone-level thermal density — Gate C hotspot highlighted
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-[8px] border border-[#E2E8F0] text-[11px] font-medium text-[#64748B]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#1FAA6D]" /> Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D68A00]" /> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C4291C]" /> High</span>
              </div>
            </div>
          </WidgetCard>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <WidgetCard title="AI Congestion Prediction" icon={TrendingUp} iconColor="#2563EB" className="min-h-[380px]">
            <AIInsightsPanel insights={AI_INSIGHTS} />
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Occupancy Trend" icon={TrendingUp} iconColor="#8B5CF6" className="min-h-[260px]">
            <AreaLineChart data={OCCUPANCY_TREND} labels={['19:00', '', '', '', '', '', '', '', '', '21:15']} color="#8B5CF6" valueFormatter={(v) => `${v}%`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Peak Analysis (Predicted)" icon={Flame} iconColor="#D68A00" className="min-h-[260px]">
            <AreaLineChart data={PREDICTION_TREND} labels={['19:00', '', '', '', '', '', '', '', '', '21:15']} color="#D68A00" valueFormatter={(v) => `${v}%`} />
          </WidgetCard>
        </div>
      </div>

      <WidgetCard title="Zone Density" icon={MapPin} iconColor="#64748B">
        <FilterBar search={search} onSearchChange={setSearch} searchPlaceholder="Search zones..." />
        <DataTable
          keyField={(r) => r.id}
          rows={filteredZones}
          emptyLabel="No zones match your search."
          columns={[
            { key: 'zone', header: 'Zone', render: (r) => <span className="font-medium text-[#0F172A]">{r.zone}</span> },
            {
              key: 'occupancy',
              header: 'Occupancy',
              render: (r) => (
                <div className="flex items-center gap-2 min-w-[160px]">
                  <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, (r.occupancy / r.capacity) * 100)}%`, backgroundColor: STATUS_TONE[r.status] === 'danger' ? '#C4291C' : STATUS_TONE[r.status] === 'warning' ? '#D68A00' : '#1FAA6D' }}
                    />
                  </div>
                  <span className="font-mono text-[12px] text-[#64748B] shrink-0">
                    {r.occupancy.toLocaleString()}/{r.capacity.toLocaleString()}
                  </span>
                </div>
              ),
            },
            { key: 'status', header: 'Status', render: (r) => <StatusPill label={r.status} tone={STATUS_TONE[r.status]} />, width: '110px' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
