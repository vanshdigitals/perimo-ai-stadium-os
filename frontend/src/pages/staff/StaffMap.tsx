import React from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { DigitalTwinWidget } from '@/features/digital-twin/components/DigitalTwinWidget'
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary'
import { PageHeader } from '@/components/widgets/PageHeader'

export const StaffMap: React.FC = () => {
  return (
    <StaffLayout>
      <PageHeader
        title="Staff Map"
        subtitle="Live stadium digital twin configured for operational awareness."
        live
      />

      <div className="w-full">
        <WidgetErrorBoundary fallbackTitle="Digital Twin Unavailable">
          <DigitalTwinWidget />
        </WidgetErrorBoundary>
      </div>
    </StaffLayout>
  )
}
