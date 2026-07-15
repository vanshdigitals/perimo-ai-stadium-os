"""Incident Engine service — lifecycle state machine + composite overview.

Rules-first (per the architecture): the lifecycle transitions and severity/summary
figures are deterministic. The state machine rejects illegal transitions.
"""

from __future__ import annotations

import uuid

from src.core.errors import ConflictError, NotFoundError, ValidationError
from src.platform.eventbus.bus import EventBus, IncidentEvent
from src.domains.incidents.repository import IncidentMetaRepository, IncidentRepository
from src.domains.incidents.schema import (
    Incident,
    IncidentOverview,
    IncidentStatus,
    IncidentSummary,
    Severity,
    SeverityDistribution,
)

# Legal lifecycle transitions (Open → Responding/Monitoring/Resolved, etc.).
_TRANSITIONS: dict[IncidentStatus, set[IncidentStatus]] = {
    IncidentStatus.Open: {IncidentStatus.Responding, IncidentStatus.Monitoring, IncidentStatus.Resolved},
    IncidentStatus.Responding: {IncidentStatus.Monitoring, IncidentStatus.Resolved},
    IncidentStatus.Monitoring: {IncidentStatus.Responding, IncidentStatus.Resolved},
    IncidentStatus.Resolved: set(),  # terminal
}

# Escalation raises severity by one step (Low→Medium→High→Critical).
_SEVERITY_LADDER = [Severity.Low, Severity.Medium, Severity.High, Severity.Critical]


class IncidentService:
    def __init__(self, incidents: IncidentRepository, meta: IncidentMetaRepository, event_bus: EventBus | None = None) -> None:
        self._incidents = incidents
        self._meta = meta
        self._event_bus = event_bus

    def _publish(self, event_type: str, incident: Incident) -> None:
        if self._event_bus:
            self._event_bus.publish_sync(
                IncidentEvent(
                    event_type=event_type,
                    payload={"id": incident.id, "status": incident.status.value, "severity": incident.severity.value}
                )
            )

    # --- reads ---

    def _sorted(self) -> list[Incident]:
        # Open items first (most urgent), Resolved last; then by id descending (newest).
        rank = {IncidentStatus.Responding: 0, IncidentStatus.Open: 1, IncidentStatus.Monitoring: 2, IncidentStatus.Resolved: 3}
        return sorted(self._incidents.list(), key=lambda i: (rank.get(i.status, 9), i.id), reverse=False)

    def list(self) -> list[Incident]:
        return self._sorted()

    def get(self, incident_id: str) -> Incident:
        inc = self._incidents.get(incident_id)
        if inc is None:
            raise NotFoundError(f"Incident {incident_id} not found.", code="incident_not_found")
        return inc

    def overview(self) -> IncidentOverview:
        meta = self._meta.get("current")
        if meta is None:
            raise NotFoundError("Incident overview data is unavailable.", code="incident_meta_missing")
        incidents = self._sorted()
        open_count = sum(1 for i in incidents if i.status != IncidentStatus.Resolved)
        dist = SeverityDistribution(
            critical=sum(1 for i in incidents if i.severity == Severity.Critical),
            high=sum(1 for i in incidents if i.severity == Severity.High),
            medium=sum(1 for i in incidents if i.severity == Severity.Medium),
            low=sum(1 for i in incidents if i.severity == Severity.Low),
        )
        return IncidentOverview(
            incidents=incidents,
            teams=meta.teams,
            escalation_matrix=meta.escalation_matrix,
            response_timeline=meta.response_timeline,
            insights=meta.insights,
            severity_distribution=dist,
            summary=IncidentSummary(
                open_count=open_count,
                critical_count=dist.critical,
                avg_response_time=meta.avg_response_time,
                teams_deployed=len(meta.teams),
                escalations_today=meta.escalations_today,
            ),
        )

    # --- writes ---

    def create(self, *, title: str, location: str, severity: Severity) -> Incident:
        incident = Incident(
            id=f"INC-{uuid.uuid4().hex[:6].upper()}",
            title=title,
            location=location,
            severity=severity,
            status=IncidentStatus.Open,
            assigned="Unassigned",
            age="now",
        )
        incident = self._incidents.save(incident)
        self._publish("incident.reported", incident)
        return incident

    def transition(self, incident_id: str, new_status: IncidentStatus) -> Incident:
        inc = self.get(incident_id)
        if new_status == inc.status:
            return inc
        if new_status not in _TRANSITIONS[inc.status]:
            raise ConflictError(
                f"Cannot move incident from {inc.status.value} to {new_status.value}.",
                code="illegal_transition",
            )
        incident = self._incidents.save(inc.model_copy(update={"status": new_status}))
        self._publish("incident.status_changed", incident)
        return incident

    def assign(self, incident_id: str, assigned: str) -> Incident:
        inc = self.get(incident_id)
        update = {"assigned": assigned}
        # Assigning an open incident moves it into Responding.
        if inc.status == IncidentStatus.Open:
            update["status"] = IncidentStatus.Responding
        incident = self._incidents.save(inc.model_copy(update=update))
        self._publish("incident.assigned", incident)
        return incident

    def escalate(self, incident_id: str) -> Incident:
        inc = self.get(incident_id)
        idx = _SEVERITY_LADDER.index(inc.severity)
        if idx >= len(_SEVERITY_LADDER) - 1:
            raise ValidationError("Incident is already at maximum severity.", code="max_severity")
        incident = self._incidents.save(inc.model_copy(update={"severity": _SEVERITY_LADDER[idx + 1]}))
        self._publish("incident.escalated", incident)
        return incident
