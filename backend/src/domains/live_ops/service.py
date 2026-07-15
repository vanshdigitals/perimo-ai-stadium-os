"""Live Operations service — aggregates all operational data into one overview."""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.domains.live_ops.repository import (
    CrowdZoneBarRepository,
    EventFeedRepository,
    LiveOpsInsightRepository,
    LiveOpsSummaryRepository,
    OperatorLogRepository,
    SystemsRepository,
)
from src.domains.live_ops.schema import LiveOpsOverview


class LiveOpsService:
    def __init__(
        self,
        systems: SystemsRepository,
        crowd_zones: CrowdZoneBarRepository,
        events: EventFeedRepository,
        operator_log: OperatorLogRepository,
        insights: LiveOpsInsightRepository,
        summary_repo: LiveOpsSummaryRepository,
    ) -> None:
        self._systems = systems
        self._crowd_zones = crowd_zones
        self._events = events
        self._operator_log = operator_log
        self._insights = insights
        self._summary_repo = summary_repo

    def overview(self) -> LiveOpsOverview:
        summary = self._summary_repo.get("current")
        if summary is None:
            raise NotFoundError("Live ops data unavailable.", code="live_ops_meta_missing")

        events = self._events.list()
        return LiveOpsOverview(
            systems=self._systems.list(),
            crowd_zones=self._crowd_zones.list(),
            event_feed=events,
            operator_log=self._operator_log.list(),
            insights=self._insights.list(),
            recent_events=events,  # Same list, frontend filters client-side
            summary=summary,
        )
