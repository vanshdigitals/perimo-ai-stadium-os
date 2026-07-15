"""Pluggable document store — the persistence seam for PERIMO Backend V2.

The architecture specifies Firestore with an in-process cache and *emulator-first*
(offline) testing. To honour that while keeping the app runnable with zero cloud
config, the store is an interface with two implementations, selected at startup
exactly like the LLM layer selects Mock vs. Gemini:

  * :class:`FirestoreStore` — real Google Cloud Firestore (used when a project id
    or emulator host is configured). Imported lazily so the SDK is only required
    when actually used.
  * :class:`MemoryStore` — an in-process, thread-safe document store seeded from
    JSON fixtures under ``src/database/seed/``. This is the offline default; it
    makes the whole platform (and its tests) run without any network or secrets.

Both expose the same minimal document-database surface: collection → document(id)
→ dict. Repositories build typed behaviour on top of this and never import a
concrete store.
"""

from __future__ import annotations

import json
import threading
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any

from src.config.logging import get_logger
from src.config.settings import Settings

logger = get_logger(__name__)

_SEED_DIR = Path(__file__).resolve().parents[2] / "database" / "seed"

#: A stored document is a plain JSON-serialisable dict; the ``id`` key is the doc id.
Document = dict[str, Any]


class DocumentStore(ABC):
    """Minimal document-database interface (collection/document/CRUD/query)."""

    @abstractmethod
    def get(self, collection: str, doc_id: str) -> Document | None: ...

    @abstractmethod
    def list(self, collection: str) -> list[Document]: ...

    @abstractmethod
    def set(self, collection: str, doc_id: str, data: Document) -> Document: ...

    @abstractmethod
    def delete(self, collection: str, doc_id: str) -> None: ...

    def query(self, collection: str, **equals: Any) -> list[Document]:
        """Return docs whose fields match every ``field=value`` in ``equals``.

        Default implementation filters :meth:`list` in memory. Concrete stores may
        override with a native indexed query.
        """
        rows = self.list(collection)
        if not equals:
            return rows
        return [r for r in rows if all(r.get(k) == v for k, v in equals.items())]


class MemoryStore(DocumentStore):
    """Thread-safe in-process store, optionally seeded from JSON fixtures.

    Data lives only for the process lifetime (writes are not persisted to disk),
    which is exactly what tests and offline development want.
    """

    def __init__(self, seed: bool = True) -> None:
        self._data: dict[str, dict[str, Document]] = {}
        self._lock = threading.RLock()
        if seed:
            self._seed_from_disk()

    def _seed_from_disk(self) -> None:
        if not _SEED_DIR.exists():
            return
        for path in sorted(_SEED_DIR.glob("*.json")):
            collection = path.stem
            try:
                raw = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                logger.warning("Failed to read seed fixture %s; skipping.", path.name)
                continue
            docs = raw if isinstance(raw, list) else raw.get("documents", [])
            bucket: dict[str, Document] = {}
            for doc in docs:
                doc_id = str(doc.get("id"))
                bucket[doc_id] = dict(doc)
            self._data[collection] = bucket
            logger.info("Seeded collection %r with %d document(s).", collection, len(bucket))

    def get(self, collection: str, doc_id: str) -> Document | None:
        with self._lock:
            doc = self._data.get(collection, {}).get(doc_id)
            return dict(doc) if doc is not None else None

    def list(self, collection: str) -> list[Document]:
        with self._lock:
            return [dict(d) for d in self._data.get(collection, {}).values()]

    def set(self, collection: str, doc_id: str, data: Document) -> Document:
        with self._lock:
            record = {**data, "id": doc_id}
            self._data.setdefault(collection, {})[doc_id] = record
            return dict(record)

    def delete(self, collection: str, doc_id: str) -> None:
        with self._lock:
            self._data.get(collection, {}).pop(doc_id, None)


class FirestoreStore(DocumentStore):
    """Google Cloud Firestore adapter (lazily imports the SDK)."""

    def __init__(self, settings: Settings) -> None:
        from google.cloud import firestore  # type: ignore[import-not-found]

        self._client = firestore.Client(project=settings.firestore_project_id)

    def get(self, collection: str, doc_id: str) -> Document | None:
        snap = self._client.collection(collection).document(doc_id).get()
        if not snap.exists:
            return None
        return {**snap.to_dict(), "id": snap.id}

    def list(self, collection: str) -> list[Document]:
        return [
            {**snap.to_dict(), "id": snap.id}
            for snap in self._client.collection(collection).stream()
        ]

    def set(self, collection: str, doc_id: str, data: Document) -> Document:
        record = {**data, "id": doc_id}
        self._client.collection(collection).document(doc_id).set(record)
        return record

    def delete(self, collection: str, doc_id: str) -> None:
        self._client.collection(collection).document(doc_id).delete()

    def query(self, collection: str, **equals: Any) -> list[Document]:
        query = self._client.collection(collection)
        for field, value in equals.items():
            query = query.where(field, "==", value)
        return [{**snap.to_dict(), "id": snap.id} for snap in query.stream()]


def build_store(settings: Settings) -> DocumentStore:
    """Return the appropriate store for ``settings`` (Firestore if configured, else memory)."""
    if settings.firestore_enabled:
        try:
            store = FirestoreStore(settings)
            logger.info("Firestore document store initialised (project=%s).", settings.firestore_project_id)
            return store
        except Exception:  # noqa: BLE001 — never crash on a missing/misconfigured SDK
            logger.warning("Firestore init failed — falling back to in-memory seeded store.")
    logger.info("Using in-memory seeded document store (offline mode).")
    return MemoryStore()
