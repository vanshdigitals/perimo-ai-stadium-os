import React from 'react'
import { FanLayout } from '@/components/layouts/FanLayout'
import { Droplet, Sparkles, RefreshCcw } from 'lucide-react'
import {
  WidgetCard,
  StatusPill,
  Timeline,
  ErrorState,
  RowsSkeleton,
} from '@/components/widgets'
import type { TimelineEvent } from '@/components/widgets'
import { useFacilities } from '@/features/facilities/useFacilities'
import type { WaterStatusValue, CleaningEvent } from '@/features/facilities/api'

const WATER_TONE: Record<WaterStatusValue, 'success' | 'warning' | 'danger'> = {
  Nominal: 'success',
  Degraded: 'warning',
  Offline: 'danger',
}
const CLEANING_TONE = new Set(['info', 'success', 'warning', 'danger'])

function toTimelineEvents(events: CleaningEvent[]): TimelineEvent[] {
  return events.map((e) => ({
    id: e.id,
    time: e.time,
    title: e.title,
    description: e.description ?? undefined,
    tone: (CLEANING_TONE.has(e.tone) ? e.tone : 'info') as TimelineEvent['tone'],
  }))
}

export const FanFacilities: React.FC = () => {
  const { data, loading, error, refetch } = useFacilities()

  if (loading && !data) {
    return (
      <FanLayout>
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">Facilities</h1>
          <p className="text-[#475569]">Restroom availability and cleaning schedules.</p>
        </div>
        <div className="flex items-center gap-3 mb-6 px-1">
          <RefreshCcw className="w-5 h-5 text-[#94A3B8] animate-spin" />
          <span className="text-[#64748B] text-sm">Loading facilities data...</span>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 md:col-span-6"><WidgetCard title="Loading…" className="min-h-[260px]"><RowsSkeleton rows={4} /></WidgetCard></div>
          <div className="col-span-12 md:col-span-6"><WidgetCard title="Loading…" className="min-h-[260px]"><RowsSkeleton rows={4} /></WidgetCard></div>
        </div>
      </FanLayout>
    )
  }

  if (error || !data) {
    return (
      <FanLayout>
        <div className="mb-6">
          <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">Facilities</h1>
          <p className="text-[#475569]">Restroom availability and cleaning schedules.</p>
        </div>
        <WidgetCard title="Facilities" className="min-h-[340px]">
          <ErrorState message={error?.message ?? 'Facilities data is currently unavailable.'} onRetry={refetch} />
        </WidgetCard>
      </FanLayout>
    )
  }

  const { water_systems, cleaning_schedule } = data

  return (
    <FanLayout>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl text-[#0F172A] tracking-tight">Facilities</h1>
        <p className="text-[#475569]">Restroom availability and cleaning schedules.</p>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Restroom & Water Status" icon={Droplet} iconColor="#2563EB" className="min-h-[260px]">
            <div className="flex flex-col gap-2">
              {water_systems.map((w) => (
                <div key={w.system} className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[13px] font-medium text-[#334155]">{w.system}</span>
                  <StatusPill label={w.status} tone={WATER_TONE[w.status]} dot />
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
        
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Cleaning Schedule" icon={Sparkles} iconColor="#1FAA6D" className="min-h-[260px]">
            <Timeline events={toTimelineEvents(cleaning_schedule)} />
          </WidgetCard>
        </div>
      </div>
    </FanLayout>
  )
}
