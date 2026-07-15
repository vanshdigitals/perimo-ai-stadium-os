"""Resource Deployment service — roster listing + assignment."""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.platform.eventbus.bus import EventBus, ResourceEvent
from src.domains.resources.repository import ResourceRepository
from src.domains.resources.schema import ResourceStatus, ResourcesResponse, ResourceUnit


class ResourceService:
    def __init__(self, resources: ResourceRepository, event_bus: EventBus | None = None) -> None:
        self._resources = resources
        self._event_bus = event_bus

    def _publish(self, event_type: str, unit: ResourceUnit) -> None:
        if self._event_bus:
            self._event_bus.publish_sync(
                ResourceEvent(
                    event_type=event_type,
                    payload={"id": unit.id, "status": unit.status.value, "assignment": unit.assignment}
                )
            )

    def list(self) -> ResourcesResponse:
        units = sorted(self._resources.list(), key=lambda u: u.id)
        deployed = sum(1 for u in units if u.status != ResourceStatus.offline)
        return ResourcesResponse(units=units, deployed=deployed, total=len(units))

    def assign(self, unit_id: str, assignment: str) -> ResourceUnit:
        unit = self._resources.get(unit_id)
        if unit is None:
            raise NotFoundError(f"Resource {unit_id} not found.", code="resource_not_found")
        unit = self._resources.save(
            unit.model_copy(update={"assignment": assignment, "status": ResourceStatus.busy})
        )
        self._publish("resource.assigned", unit)
        return unit
