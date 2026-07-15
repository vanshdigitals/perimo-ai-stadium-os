import React from 'react'
import { FanLayout } from '@/components/layouts/FanLayout'
import { Bus, Car, TrainFront, RefreshCcw } from 'lucide-react'
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates'
import {
  StatusStrip,
  KPICard,
  WidgetCard,
  Timeline,
  DataTable,
  ErrorState,
  KPISkeleton,
  ChartSkeleton,
} from '@/components/widgets'
import { useTransport } from '@/features/transportation/useTransport'

export const FanTransport: React.FC = () => {
  const { data, isLoading, error } = useTransport()
  useLiveUpdates()

  if (error) {
    return (
      <FanLayout>
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">Transportation</h1>
          <p className="text-[#475569]">Live shuttle times and parking availability.</p>
        </div>
        <ErrorState message={error.message} onRetry={() => window.location.reload()} />
      </FanLayout>
    )
  }

  return (
    <FanLayout>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">Transportation</h1>
        <p className="text-[#475569]">Live shuttle times and parking availability.</p>
      </div>

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
          ]}
        />
      )}

      <div className="grid grid-cols-12 gap-5 mb-5 mt-5">
        <div className="col-span-12 md:col-span-4">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="General Parking" value={data?.summary.general_parking_pct.toString()!} unit="%" icon={Car} iconColor="#2563EB" delta={{ value: '+6% vs 30 min ago', direction: 'up', positive: false }} sparkline={[62, 68, 74, 78, 81, 83, data?.summary.general_parking_pct!]} />
          )}
        </div>
        <div className="col-span-12 md:col-span-4">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Shuttle Arrivals" value={data?.summary.shuttle_arrivals_15m.toString()!} unit="/15 min" icon={Bus} iconColor="#1FAA6D" delta={{ value: 'On schedule', direction: 'flat' }} />
          )}
        </div>
        <div className="col-span-12 md:col-span-4">
          {isLoading ? <KPISkeleton /> : (
            <KPICard label="Rail Status" value="Normal" icon={TrainFront} iconColor="#8B5CF6" delta={{ value: data?.summary.rail_status!, direction: 'flat' }} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
          <WidgetCard title="Shuttle Tracking" icon={Bus} iconColor="#1FAA6D" className="min-h-[280px]">
            {isLoading ? <ChartSkeleton height={200} /> : (
              <DataTable
                keyField={(r) => r.id}
                rows={data?.shuttles || []}
                columns={[
                  { key: 'route', header: 'Route', render: (r) => r.route },
                  { key: 'eta', header: 'ETA', render: (r) => <span className="font-mono">{r.eta}</span>, width: '100px' },
                ]}
              />
            )}
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Public Transit" icon={TrainFront} iconColor="#8B5CF6" className="min-h-[280px]">
            {isLoading ? <ChartSkeleton height={200} /> : (
              <Timeline events={data?.transit_events || []} />
            )}
          </WidgetCard>
        </div>
      </div>
    </FanLayout>
  )
}
