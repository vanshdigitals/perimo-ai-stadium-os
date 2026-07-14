import React from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';

// Strips
import { PlatformHealthStrip } from '@/features/command-center/components/PlatformHealthStrip';
import { LiveOperationsSummary } from '@/features/command-center/components/LiveOperationsSummary';

// Level 1 — Primary canvas
import { DigitalTwinWidget } from '@/features/digital-twin/components/DigitalTwinWidget';

// Level 2 — Decision surface
import { AIOperationsWidget } from '@/features/ai/components/AIOperationsWidget';

// Level 3 — Supporting detail
import { CriticalAlertsWidget } from '@/features/command-center/components/CriticalAlertsWidget';
import { CrowdGatesWidget } from '@/features/command-center/components/CrowdGatesWidget';
import { ResourceDeploymentWidget } from '@/features/command-center/components/ResourceDeploymentWidget';

// Error boundary
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary';

// WebSocket data
import { useLiveUpdates } from '@/features/digital-twin/hooks/useLiveUpdates';

/**
 * AdminDashboard — Command Center canvas.
 *
 * Layout per IA redesign §6 (Bento Grid) & §7 (Responsive):
 *
 * Zone 0 — Ambient strips (full-width, always first, never part of column system)
 *   Strip 1: PlatformHealthStrip   (min-h-52px, wraps instead of scrolling)
 *   Strip 2: LiveOperationsSummary (min-h-52px, wraps instead of scrolling)
 *
 * Zone 1 — Primary row (grid, height-matched via CSS Grid stretch)
 *   col-span-8: DigitalTwinWidget  (~68% width, aspect-video ~16:9 — defines row height)
 *   col-span-4: AIOperationsWidget (~32% width, h-full stretches to match)
 *
 * Zone 2 — Secondary row (4:5:3 — chart gets more room than the alert list)
 *   col-span-4: CriticalAlertsWidget     (~33%)
 *   col-span-5: CrowdGatesWidget         (~42%)
 *   col-span-3: ResourceDeploymentWidget (~25%)
 */
export const AdminDashboard: React.FC = () => {
  const { gates, units } = useLiveUpdates();

  return (
    <AdminLayout>
      {/* ── Page Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em]">
          Command Center
        </h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px]
                       hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors duration-200 outline-none
                       focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            Export Report
          </button>
          <button
            className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px]
                       hover:bg-[#1D4ED8] transition-colors duration-200 outline-none border-none
                       focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            Broadcast Alert
          </button>
        </div>
      </div>

      {/* ── Zone 0 — Ambient Strips ─────────────────────────── */}
      {/* Strips sit outside the column grid — full-width, never stacked, per IA §7.
          Tighter 8px gap between the two strips (one "ambient" reading unit),
          20px gap below matching the grid's own gap-5 rhythm. */}
      <div className="flex flex-col gap-2 mb-5" aria-label="Ambient status zone">
        <PlatformHealthStrip />
        <LiveOperationsSummary gates={gates} />
      </div>

      {/* ── Zone 1 — Primary Row ────────────────────────────── */}
      {/* Digital Twin (col-8) + AI Copilot (col-4), height-matched via CSS Grid rows. */}
      {/* At xl: 8+4=12. At lg: 7+5=12. At md/below: both stack col-span-12. */}
      <div className="grid grid-cols-12 gap-5 mb-5" aria-label="Primary decision zone">
        {/* Digital Twin — Level 1 canvas */}
        <div className="col-span-12 lg:col-span-7 xl:col-span-8">
          <WidgetErrorBoundary fallbackTitle="Digital Twin Unavailable">
            <DigitalTwinWidget />
          </WidgetErrorBoundary>
        </div>

        {/* AI Copilot — Level 2 decision surface, height-matched */}
        <div className="col-span-12 lg:col-span-5 xl:col-span-4">
          <WidgetErrorBoundary fallbackTitle="AI Copilot Unavailable">
            <AIOperationsWidget />
          </WidgetErrorBoundary>
        </div>
      </div>

      {/* ── Zone 2 — Secondary Row ──────────────────────────── */}
      {/* Width gradient 4:5:3 (never equal) — rebalanced so the chart-heavy
          Crowd & Gates widget gets the most breathing room instead of Critical
          Alerts (a compact list that doesn't need the widest slot). At lg: 6:6
          with ResourceDeployment below. At md/sm: all stack col-12. */}
      <div
        className="grid grid-cols-12 gap-5"
        aria-label="Supporting detail zone"
      >
        {/* Critical Alerts — compact list, no longer the widest card */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-4">
          <CriticalAlertsWidget />
        </div>

        {/* Crowd & Gates — merged single widget, widest of the three (chart breathing room) */}
        <div className="col-span-12 lg:col-span-6 xl:col-span-5">
          <CrowdGatesWidget gates={gates} />
        </div>

        {/* Resource Deployment — narrowest, rightmost; "who's already on it" confirmation */}
        <div className="col-span-12 xl:col-span-3">
          <ResourceDeploymentWidget units={units} />
        </div>
      </div>
    </AdminLayout>
  );
};
