import React, { useState, useEffect, useRef } from 'react'
import { VolunteerLayout } from '@/components/layouts/VolunteerLayout'
import { LiveMap } from '@/features/digital-twin/components/LiveMap'
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates'
import { PageHeader } from '@/components/widgets/PageHeader'

export const VolunteerMap: React.FC = () => {
  const { units, gates, thermal, crowdFlows } = useLiveUpdates()
  const [floor, setFloor] = useState<'L3' | 'L2' | 'L1' | 'P1'>('L1')
  const [zoom, setZoom] = useState(17)
  const [isVisible, setIsVisible] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (widgetRef.current) observer.observe(widgetRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <VolunteerLayout>
      <PageHeader
        title="Wayfinding Map"
        subtitle="Help attendees navigate the stadium."
      />

      <div ref={widgetRef} className="w-full aspect-[4/3] sm:aspect-video bg-[#F8FAFC] rounded-[16px] border border-[#E2E8F0] shadow-sm flex items-center justify-center relative overflow-hidden mt-6">
        {isVisible && (
          <LiveMap 
            units={units}
            gates={gates}
            thermal={thermal}
            crowdFlows={crowdFlows}
            isVisible={isVisible} 
            layerMode="Physical"
            floor={floor}
            zoom={zoom}
          />
        )}

        <div className="absolute inset-0 z-10 pointer-events-none p-4 flex flex-col justify-between">
          <div className="flex items-start justify-end w-full">
            <div className="flex flex-col bg-white shadow-sm border border-[#E2E8F0] rounded-[8px] pointer-events-auto overflow-hidden">
              <button onClick={() => setZoom(z => Math.min(z + 1, 21))} className="w-10 h-10 flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC] border-b border-[#E2E8F0]">
                +
              </button>
              <button onClick={() => setZoom(z => Math.max(z - 1, 10))} className="w-10 h-10 flex items-center justify-center text-[#475569] hover:bg-[#F8FAFC]">
                -
              </button>
            </div>
          </div>
          <div className="flex items-end justify-end w-full">
            <div className="flex flex-col bg-white shadow-sm border border-[#E2E8F0] rounded-[8px] pointer-events-auto overflow-hidden">
              {(['L3', 'L2', 'L1', 'P1'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setFloor(f)}
                  className={`w-10 h-10 text-[13px] font-medium transition-colors border-b border-[#E2E8F0] last:border-b-0 ${
                    floor === f ? 'text-[#0F172A] bg-[#F1F5F9]' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VolunteerLayout>
  )
}
