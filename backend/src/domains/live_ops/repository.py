"""Repositories for the Live Operations domain."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.live_ops.schema import (
    SystemHealth, CrowdZoneBar, EventFeedItem, OperatorLogEntry,
    LiveOpsInsight, LiveOpsSummary,
)


class SystemsRepository(Repository[SystemHealth]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_systems", model=SystemHealth)


class CrowdZoneBarRepository(Repository[CrowdZoneBar]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_crowd_zones", model=CrowdZoneBar)


class EventFeedRepository(Repository[EventFeedItem]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_events", model=EventFeedItem)


class OperatorLogRepository(Repository[OperatorLogEntry]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_operator_log", model=OperatorLogEntry)


class LiveOpsInsightRepository(Repository[LiveOpsInsight]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_insights", model=LiveOpsInsight)


class LiveOpsSummaryRepository(Repository[LiveOpsSummary]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="live_ops_summary", model=LiveOpsSummary)
