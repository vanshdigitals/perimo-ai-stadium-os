"""Repositories for the Authentication module (users + sessions)."""

from __future__ import annotations

from src.platform.firestore.store import DocumentStore
from src.platform.firestore.repository import Repository
from src.security.auth.schemas import Session, User


class UserRepository(Repository[User]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="users", model=User)

    def get_by_email(self, email: str) -> User | None:
        matches = self.query(email=email.strip().lower())
        return matches[0] if matches else None


class SessionRepository(Repository[Session]):
    def __init__(self, store: DocumentStore) -> None:
        super().__init__(store, collection="sessions", model=Session)
