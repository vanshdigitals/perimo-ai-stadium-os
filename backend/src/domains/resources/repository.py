"""Repository for the Resource Deployment domain."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.domains.resources.schema import ResourceUnit


class ResourceRepository(Repository[ResourceUnit]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="resources", model=ResourceUnit)
