import React from 'react'
import { VolunteerLayout } from '@/components/layouts/VolunteerLayout'
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates'
import { CrowdGatesWidget } from '@/features/command-center/components/CrowdGatesWidget'
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary'
import { PageHeader } from '@/components/widgets/PageHeader'

export const VolunteerDashboard: React.FC = () => {
  const { gates } = useLiveUpdates()

  return (
    <VolunteerLayout>
      <PageHeader
        title="Volunteer Dashboard"
        subtitle="Your assigned zone and current crowd metrics."
        live
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="md:col-span-2">
          <WidgetErrorBoundary fallbackTitle="Crowd Metrics Unavailable">
            <CrowdGatesWidget gates={gates} />
          </WidgetErrorBoundary>
        </div>
      </div>
    </VolunteerLayout>
  )
}
