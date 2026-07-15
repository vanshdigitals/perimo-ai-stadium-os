"""Typed repository base over the document store.

Repositories are the only code that touches the persistence layer. They serialize
Pydantic models to/from plain documents and expose a small, typed CRUD surface,
so services and routers never see raw dicts or the concrete store implementation.
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

from src.platform.firestore.store import DocumentStore

ModelT = TypeVar("ModelT", bound=BaseModel)


class Repository(Generic[ModelT]):
    """Generic document repository for a single collection and Pydantic model.

    ``id_field`` names the model attribute used as the document id.
    """

    def __init__(
        self,
        store: DocumentStore,
        collection: str,
        model: type[ModelT],
        *,
        id_field: str = "id",
    ) -> None:
        self._store = store
        self._collection = collection
        self._model = model
        self._id_field = id_field

    def _to_model(self, doc: dict[str, Any]) -> ModelT:
        return self._model.model_validate(doc)

    def get(self, doc_id: str) -> ModelT | None:
        doc = self._store.get(self._collection, doc_id)
        return self._to_model(doc) if doc is not None else None

    def list(self) -> list[ModelT]:
        return [self._to_model(d) for d in self._store.list(self._collection)]

    def query(self, **equals: Any) -> list[ModelT]:
        return [self._to_model(d) for d in self._store.query(self._collection, **equals)]

    def save(self, model: ModelT) -> ModelT:
        doc = model.model_dump(mode="json")
        doc_id = str(getattr(model, self._id_field))
        saved = self._store.set(self._collection, doc_id, doc)
        return self._to_model(saved)

    def delete(self, doc_id: str) -> None:
        self._store.delete(self._collection, doc_id)
