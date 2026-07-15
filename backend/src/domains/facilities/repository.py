"""Repositories for the Facilities domain."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.facilities.schema import FacilitySystemsDoc, MaintenanceRequest


class FacilitySystemsRepository(Repository[FacilitySystemsDoc]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="facility_systems", model=FacilitySystemsDoc)


class MaintenanceRepository(Repository[MaintenanceRequest]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="facility_maintenance", model=MaintenanceRequest)
