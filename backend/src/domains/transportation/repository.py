"""Repositories for the Transportation domain."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.transportation.schema import (
    ParkingLot, Shuttle, RoadCondition, TransitEvent, TransportInsight, TransportSummary,
)


class ParkingRepository(Repository[ParkingLot]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_parking", model=ParkingLot)


class ShuttleRepository(Repository[Shuttle]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_shuttles", model=Shuttle)


class RoadRepository(Repository[RoadCondition]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_roads", model=RoadCondition)


class TransitEventRepository(Repository[TransitEvent]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_events", model=TransitEvent)


class TransportInsightRepository(Repository[TransportInsight]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_insights", model=TransportInsight)


class TransportSummaryRepository(Repository[TransportSummary]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="transport_summary", model=TransportSummary)
