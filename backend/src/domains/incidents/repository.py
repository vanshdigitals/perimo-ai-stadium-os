"""Repositories for the Incident Engine."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.incidents.schema import Incident, IncidentMetaDoc


class IncidentRepository(Repository[Incident]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="incidents", model=Incident)


class IncidentMetaRepository(Repository[IncidentMetaDoc]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="incident_meta", model=IncidentMetaDoc)
