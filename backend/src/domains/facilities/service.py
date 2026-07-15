"""Facilities service — composes stored systems + maintenance into one overview."""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.domains.facilities.repository import (
    FacilitySystemsRepository,
    MaintenanceRepository,
)
from src.domains.facilities.schema import (
    FacilitiesOverview,
    FacilitiesSummary,
    MaintenanceStatus,
)


class FacilitiesService:
    def __init__(
        self,
        systems: FacilitySystemsRepository,
        maintenance: MaintenanceRepository,
    ) -> None:
        self._systems = systems
        self._maintenance = maintenance

    def overview(self) -> FacilitiesOverview:
        doc = self._systems.get("current")
        if doc is None:
            raise NotFoundError("Facilities systems data is unavailable.", code="systems_missing")

        requests = self._maintenance.list()
        # Deterministic ordering: open items first, then by id.
        order = {MaintenanceStatus.Dispatched: 0, MaintenanceStatus.Queued: 1, MaintenanceStatus.Resolved: 2}
        requests.sort(key=lambda r: (order.get(r.status, 9), r.id))
        open_count = sum(1 for r in requests if r.status != MaintenanceStatus.Resolved)

        return FacilitiesOverview(
            power=doc.power,
            hvac_zones=doc.hvac_zones,
            water_systems=doc.water_systems,
            maintenance=requests,
            cleaning_schedule=doc.cleaning_schedule,
            summary=FacilitiesSummary(
                avg_core_temp_f=doc.summary_avg_temp_f,
                sanitation=doc.summary_sanitation,
                open_maintenance=open_count,
            ),
        )
