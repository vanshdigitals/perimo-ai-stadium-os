"""Repositories for the Notification Engine."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.notifications.schema import Notification, NotificationMetaDoc


class NotificationRepository(Repository[Notification]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="notifications", model=Notification)


class NotificationMetaRepository(Repository[NotificationMetaDoc]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="notifications_meta", model=NotificationMetaDoc)
