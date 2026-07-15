"""Transportation service — aggregates parking, shuttles, roads, transit events."""

from __future__ import annotations

from src.core.errors import NotFoundError
from src.domains.transportation.repository import (
    ParkingRepository,
    RoadRepository,
    ShuttleRepository,
    TransitEventRepository,
    TransportInsightRepository,
    TransportSummaryRepository,
)
from src.domains.transportation.schema import TransportOverview


class TransportService:
    def __init__(
        self,
        parking: ParkingRepository,
        shuttles: ShuttleRepository,
        roads: RoadRepository,
        events: TransitEventRepository,
        insights: TransportInsightRepository,
        summary_repo: TransportSummaryRepository,
    ) -> None:
        self._parking = parking
        self._shuttles = shuttles
        self._roads = roads
        self._events = events
        self._insights = insights
        self._summary_repo = summary_repo

    def overview(self) -> TransportOverview:
        summary_doc = self._summary_repo.get("current")
        if summary_doc is None:
            raise NotFoundError("Transport summary unavailable.", code="transport_meta_missing")

        return TransportOverview(
            parking=sorted(self._parking.list(), key=lambda p: p.lot),
            shuttles=sorted(self._shuttles.list(), key=lambda s: s.id),
            roads=self._roads.list(),
            transit_events=self._events.list(),
            insights=self._insights.list(),
            summary=summary_doc,
        )
