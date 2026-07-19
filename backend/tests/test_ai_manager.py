"""AI service manager tests — offline mock, retry/backoff, circuit breaker."""

from __future__ import annotations

import asyncio

import pytest

from src.config.settings import Settings
from src.platform.ai import manager as manager_mod
from src.platform.ai.manager import CircuitState, GeminiServiceManager


def _offline_manager() -> GeminiServiceManager:
    return GeminiServiceManager(Settings(gemini_api_key=None))


class _FakeResponse:
    def __init__(self, text: str) -> None:
        self.text = text


class _FakeModel:
    """Stand-in for the Gemini model with controllable outcomes."""

    def __init__(self, *, fail_times: int = 0, text: str = "ok") -> None:
        self.calls = 0
        self._fail_times = fail_times
        self._text = text

    async def generate_content_async(self, prompt, **kwargs):
        self.calls += 1
        if self.calls <= self._fail_times:
            raise RuntimeError("simulated upstream failure")
        return _FakeResponse(self._text)


@pytest.fixture(autouse=True)
def _no_sleep(monkeypatch):
    async def _instant(*_a, **_k):
        return None

    monkeypatch.setattr(manager_mod.asyncio, "sleep", _instant)


def test_offline_returns_mock_string():
    mgr = _offline_manager()
    out = asyncio.run(mgr.generate_content("hi"))
    assert "Mock AI Response" in out


def test_health_starts_closed_and_healthy():
    health = _offline_manager().check_health()
    assert health["circuit_state"] == CircuitState.CLOSED.value
    assert health["status"] == "healthy"
    assert health["using_backup"] is False


def test_success_path_returns_model_text():
    mgr = _offline_manager()
    mgr.model = _FakeModel(text="hello world")
    assert asyncio.run(mgr.generate_content("prompt")) == "hello world"


def test_retry_then_succeed_within_backoff():
    mgr = _offline_manager()
    mgr.model = _FakeModel(fail_times=2, text="recovered")
    # max_retries=3 → two failures then success returns cleanly.
    assert asyncio.run(mgr.generate_content("prompt")) == "recovered"


def test_circuit_opens_after_repeated_failures():
    mgr = _offline_manager()
    mgr.backup_key = None  # no failover path
    mgr.model = _FakeModel(fail_times=999)
    for _ in range(mgr.failure_threshold):
        with pytest.raises(Exception):
            asyncio.run(mgr.generate_content("prompt"))
    assert mgr.state == CircuitState.OPEN
    assert mgr.check_health()["status"] == "failing"


def test_open_circuit_without_backup_raises_fast():
    mgr = _offline_manager()
    mgr.model = _FakeModel()  # truthy model so we reach the circuit-breaker logic
    mgr.backup_key = None
    mgr.state = CircuitState.OPEN
    mgr.last_failure_time = 10**12  # far future → stays OPEN, no recovery window
    with pytest.raises(RuntimeError):
        asyncio.run(mgr.generate_content("prompt"))
