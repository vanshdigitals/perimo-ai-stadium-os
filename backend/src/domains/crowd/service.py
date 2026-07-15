"""Crowd Intelligence service — derives the overview + summary from zone data.

This is the single source of truth for admin crowd figures: the summary counts
(total occupancy, congestion levels, highest-density zone) are *derived* from the
stored zones, so the dashboard and any future consumer stay consistent.
"""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.domains.crowd.repository import CrowdMetaRepository, CrowdZoneRepository
from src.domains.crowd.schema import CrowdOverview, CrowdSummary, ZoneStatus


class CrowdService:
    def __init__(self, zones: CrowdZoneRepository, meta: CrowdMetaRepository) -> None:
        self._zones = zones
        self._meta = meta

    def overview(self, gates_tracked: int = 3) -> CrowdOverview:
        meta = self._meta.get("current")
        if meta is None:
            raise NotFoundError("Crowd data is unavailable.", code="crowd_missing")

        zones = sorted(self._zones.list(), key=lambda z: z.id)
        total = sum(z.occupancy for z in zones)
        critical = sum(1 for z in zones if z.status == ZoneStatus.Critical)
        elevated = sum(1 for z in zones if z.status == ZoneStatus.Elevated)
        # "Highest density" = most severe status first, then occupancy ratio — so a
        # Critical zone outranks a merely fuller Nominal zone (matches the UI intent).
        status_rank = {ZoneStatus.Critical: 2, ZoneStatus.Elevated: 1, ZoneStatus.Nominal: 0}
        highest = max(
            zones,
            key=lambda z: (status_rank.get(z.status, 0), z.occupancy / z.capacity),
            default=None,
        )

        return CrowdOverview(
            zones=zones,
            occupancy_trend=meta.occupancy_trend,
            prediction_trend=meta.prediction_trend,
            flow_sparkline=meta.flow_sparkline,
            insights=meta.insights,
            summary=CrowdSummary(
                total_occupancy=total,
                projected_peak=meta.projected_peak,
                highest_density_zone=highest.zone if highest else "—",
                gates_tracked=gates_tracked,
                congestion_critical=critical,
                congestion_elevated=elevated,
                avg_flow_rate=meta.avg_flow_rate,
                avg_flow_delta=meta.avg_flow_delta,
            ),
        )
