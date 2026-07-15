"""Repositories for the Crowd Intelligence domain."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.crowd.schema import CrowdMetaDoc, ZoneRow


class CrowdZoneRepository(Repository[ZoneRow]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="crowd_zones", model=ZoneRow)


class CrowdMetaRepository(Repository[CrowdMetaDoc]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="crowd_meta", model=CrowdMetaDoc)
