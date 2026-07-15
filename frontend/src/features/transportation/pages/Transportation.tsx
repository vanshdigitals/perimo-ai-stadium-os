import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Bus, Car, TrainFront, Navigation, MapPinned, RefreshCcw } from 'lucide-react';
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';
import {
  PageHeader,
  StatusStrip,
  KPICard,
  WidgetCard,
  Timeline,
  AIInsightsPanel,
  StatusPill,
  DataTable,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets';
import { useTransport } from '@/features/transportation/useTransport';

const ROAD_TONE: Record<string, 'danger' | 'warning' | 'success'> = { Heavy: 'danger', Moderate: 'warning', Clear: 'success' };

export const Transportation: React.FC = () => {
  const { data, isLoading, error } = useTransport();

  // Subscribe to transport events if backend sends them (optional if using live updates)
  useLiveUpdates();

  if (error) {
    return (
      <AdminLayout>
        <PageHeader title="Transportation" subtitle="Inbound/outbound transit, parking capacity, and VIP routing." />
        <ErrorState message={error.message} onRetry={() => window.location.reload()} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader title="Transportation" subtitle="Inbound/outbound transit, parking capacity, and VIP routing." live />

      {isLoading ? (
        <div className="flex items-center gap-3 mb-6 px-1">
          <RefreshCcw className="w-5 h-5 text-[#94A3B8] animate-spin" />
          <span className="text-[#64748B] text-sm">Loading live metrics...</span>
        </div>
      ) : (
        <StatusStrip
          items={[
            { label: 'General Parking', value: `${data?.summary.general_parking_pct}% full`, tone: data?.summary.general_parking_pct! > 90 ? 'critical' : 'warning' },
            { label: 'Shuttle Arrivals', value: `${data?.summary.shuttle_arrivals_15m} in next 15m` },
            { label: 'Rail Station', value: data?.summary.rail_status || 'Unknown' },
            { label: 'VIP Escorts', value: `${data?.summary.vip_escorts_en_route} en route` },
          ]}
        />
      )}

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="General Parking" value={data?.summary.general_parking_pct.toString()!} unit="%" icon={Car} iconColor="#2563EB" delta={{ value: '+6% vs 30 min ago', direction: 'up', positive: false }} sparkline={[62, 68, 74, 78, 81, 83, data?.summary.general_parking_pct!]} />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Shuttle Arrivals" value={data?.summary.shuttle_arrivals_15m.toString()!} unit="/15 min" icon={Bus} iconColor="#1FAA6D" delta={{ value: 'On schedule', direction: 'flat' }} />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Rail Status" value="Normal" icon={TrainFront} iconColor="#8B5CF6" delta={{ value: data?.summary.rail_status!, direction: 'flat' }} />
          )}
        </div>
        <div className="col-span-6 lg:col-span-3">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="VIP Escorts" value={data?.summary.vip_escorts_en_route.toString()!} unit="en route" icon={Navigation} iconColor="#D68A00" delta={{ value: 'ETA 4–9 min', direction: 'flat' }} />
          )}
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
            {isLoading ? <ChartSkeleton height={300} /> : (
              <>
                <div className="flex flex-col gap-4">
                  {data?.parking.map((lot) => (
                    <div key={lot.lot}>
                      <div className="flex justify-between text-[13px] mb-1.5">
                        <span className="font-medium text-[#334155]">{lot.lot}</span>
                        <span className="text-[#64748B] font-mono">{lot.pct}%</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${lot.pct}%`, backgroundColor: lot.pct > 90 ? '#C4291C' : lot.pct > 75 ? '#D68A00' : '#2563EB' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <AIInsightsPanel insights={data?.insights || []} />
                </div>
              </>
            )}
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <WidgetCard title="Shuttle Tracking" icon={Bus} iconColor="#1FAA6D" className="min-h-[280px]">
            {isLoading ? <ChartSkeleton height={200} /> : (
              <DataTable
                keyField={(r) => r.id}
                rows={data?.shuttles || []}
                columns={[
                  { key: 'id', header: 'Unit', render: (r) => <span className="font-mono text-[#64748B]">{r.id}</span>, width: '70px' },
                  { key: 'route', header: 'Route', render: (r) => r.route },
                  { key: 'eta', header: 'ETA', render: (r) => <span className="font-mono">{r.eta}</span>, width: '70px' },
                  { key: 'occupancy', header: 'Load', render: (r) => <span className="font-mono text-[#64748B]">{r.occupancy}</span>, width: '80px', align: 'right' },
                ]}
              />
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Road Congestion" icon={Navigation} iconColor="#D68A00" className="min-h-[280px]">
            {isLoading ? <ChartSkeleton height={200} /> : (
              <div className="flex flex-col gap-2">
                {data?.roads.map((r) => (
                  <div key={r.segment} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[#334155] truncate">{r.segment}</div>
                      <div className="text-[11px] text-[#94A3B8]">{r.delay}</div>
                    </div>
                    <StatusPill label={r.status} tone={ROAD_TONE[r.status] || 'info'} />
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-3">
          <WidgetCard title="Public Transit" icon={TrainFront} iconColor="#8B5CF6" className="min-h-[280px]">
            {isLoading ? <ChartSkeleton height={200} /> : (
              <Timeline events={data?.transit_events || []} />
            )}
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
