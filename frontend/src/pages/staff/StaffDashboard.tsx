import React from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { LiveOperationsSummary } from '@/features/command-center/components/LiveOperationsSummary'
import { CriticalAlertsWidget } from '@/features/command-center/components/CriticalAlertsWidget'
import { ResourceDeploymentPanel } from '@/features/command-center/components/ResourceDeploymentPanel'
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates'
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary'

export const StaffDashboard: React.FC = () => {
  const { gates } = useLiveUpdates()

  return (
    <StaffLayout>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">
          Staff Dashboard
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px]
                       hover:bg-[#1D4ED8] transition-colors duration-200 outline-none border-none
                       focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            Report Incident
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5" aria-label="Ambient status zone">
        <LiveOperationsSummary gates={gates} />
      </div>

      <div className="grid grid-cols-12 gap-5" aria-label="Primary zone">
        <div className="col-span-12 lg:col-span-8">
          <WidgetErrorBoundary fallbackTitle="Alerts Unavailable">
            <CriticalAlertsWidget />
          </WidgetErrorBoundary>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <WidgetErrorBoundary fallbackTitle="Resources Unavailable">
            <ResourceDeploymentPanel />
          </WidgetErrorBoundary>
        </div>
      </div>
    </StaffLayout>
  )
}
