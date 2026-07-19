"""Repository + document-store layer tests (in-memory store CRUD + query)."""

from __future__ import annotations

import pytest
from pydantic import BaseModel

from src.platform.firestore.repository import Repository
from src.platform.firestore.store import MemoryStore


class Widget(BaseModel):
    id: str
    name: str
    kind: str = "std"


@pytest.fixture
def repo() -> Repository[Widget]:
    return Repository(MemoryStore(seed=False), collection="widgets", model=Widget)


def test_save_and_get_roundtrip(repo):
    repo.save(Widget(id="w1", name="Alpha"))
    got = repo.get("w1")
    assert got is not None and got.name == "Alpha"


def test_get_missing_returns_none(repo):
    assert repo.get("absent") is None


def test_list_returns_all_saved(repo):
    repo.save(Widget(id="w1", name="A"))
    repo.save(Widget(id="w2", name="B"))
    assert {w.id for w in repo.list()} == {"w1", "w2"}


def test_query_filters_by_equality(repo):
    repo.save(Widget(id="w1", name="A", kind="special"))
    repo.save(Widget(id="w2", name="B", kind="std"))
    special = repo.query(kind="special")
    assert [w.id for w in special] == ["w1"]


def test_query_no_match_returns_empty(repo):
    repo.save(Widget(id="w1", name="A"))
    assert repo.query(kind="nonexistent") == []


def test_save_overwrites_existing(repo):
    repo.save(Widget(id="w1", name="Original"))
    repo.save(Widget(id="w1", name="Updated"))
    assert repo.get("w1").name == "Updated"
    assert len(repo.list()) == 1


def test_delete_removes_document(repo):
    repo.save(Widget(id="w1", name="A"))
    repo.delete("w1")
    assert repo.get("w1") is None


def test_delete_missing_is_noop(repo):
    repo.delete("absent")  # must not raise
    assert repo.list() == []


def test_store_query_on_empty_collection(repo):
    # Querying a never-populated collection is safe and empty.
    assert repo.query(name="anything") == []


def test_memory_store_seeds_known_collections():
    store = MemoryStore(seed=True)
    # The seeded store exposes the domain collections used across the app.
    assert store.list("incidents")
    assert store.get("incidents", store.list("incidents")[0]["id"]) is not None
