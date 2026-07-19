"""AI Operations Copilot service.

Turns a live dashboard snapshot into ranked, advisory recommendations. When a
live LLM is configured it is used to enrich the analysis; when it is absent or
fails, a deterministic rules-based fallback derived from the same context is
returned instead. Either way the endpoint yields a valid, non-leaky response —
internal errors are logged server-side and never surfaced to the client.
"""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone

from src.config.logging import get_logger
from src.domains.copilot.schema import (
    Classification,
    CopilotRecommendation,
    DashboardContext,
)
from src.platform.ai.manager import GeminiServiceManager, ai_manager

logger = get_logger(__name__)

_RESPONSE_KEYS = (
    "title",
    "explanation",
    "whyItMatters",
    "confidence",
    "recommendedAction",
    "estimatedImpact",
    "classification",
)


class CopilotService:
    """Generates operational recommendations from a dashboard snapshot."""

    def __init__(self, ai: GeminiServiceManager | None = None) -> None:
        self._ai = ai or ai_manager

    async def recommend(self, context: DashboardContext) -> list[CopilotRecommendation]:
        """Return recommendations for ``context``.

        Attempts the LLM first; on any failure (offline, malformed output, circuit
        open) falls back to deterministic rules so the caller always gets a usable,
        grounded result.
        """
        raw = await self._try_llm(context)
        if raw is None:
            raw = self._fallback(context)
        return [self._finalize(item) for item in raw]

    # --- internals ---

    async def _try_llm(self, context: DashboardContext) -> list[dict] | None:
        try:
            text = await self._ai.generate_content(self._build_prompt(context))
            parsed = json.loads(self._strip_code_fence(text))
            if isinstance(parsed, list) and all(isinstance(x, dict) for x in parsed):
                # Only trust well-formed items; ignore anything missing core keys.
                usable = [x for x in parsed if {"title", "recommendedAction"} <= x.keys()]
                return usable or None
            return None
        except Exception as exc:  # noqa: BLE001 — degrade gracefully, never leak details
            logger.warning(
                "Copilot LLM path unavailable (%s); using rules-based fallback.",
                exc.__class__.__name__,
            )
            return None

    def _build_prompt(self, context: DashboardContext) -> str:
        payload = json.dumps(context.model_dump(by_alias=True), indent=2, default=str)
        return (
            "You are the AI Operations Copilot for PERIMO, a Smart Stadium & Tournament "
            "Operations platform. Analyse the live dashboard state and return specific, "
            "actionable operational recommendations. Never execute actions automatically — "
            "you only recommend them.\n\n"
            f"Current dashboard state:\n{payload}\n\n"
            "Respond with a JSON array of objects using exactly these keys: "
            f"{', '.join(_RESPONSE_KEYS)}."
        )

    @staticmethod
    def _strip_code_fence(text: str) -> str:
        t = text.strip()
        if t.startswith("```json"):
            t = t[len("```json"):]
        elif t.startswith("```"):
            t = t[len("```"):]
        if t.endswith("```"):
            t = t[: -len("```")]
        return t.strip()

    def _fallback(self, context: DashboardContext) -> list[dict]:
        """Deterministic recommendations derived directly from the dashboard signals."""
        recs: list[dict] = []

        if context.thermal_anomalies > 0:
            recs.append({
                "title": f"Investigate {context.thermal_anomalies} thermal anomaly(ies)",
                "explanation": "Thermal sensors report readings outside the safe operating band.",
                "whyItMatters": "Early thermal detection prevents equipment failures and fire risk.",
                "confidence": 0.82,
                "recommendedAction": "Dispatch a facilities unit to inspect the flagged zones.",
                "estimatedImpact": "Reduces incident escalation risk",
                "classification": Classification.safety.value,
            })

        congested = [z for z in context.crowd_congestion if z.density in {"high", "medium"}]
        if congested:
            zones = ", ".join(z.zone for z in congested[:3])
            recs.append({
                "title": "Relieve crowd congestion",
                "explanation": f"Elevated density detected in: {zones}.",
                "whyItMatters": "Sustained high density raises crush and egress-delay risk.",
                "confidence": 0.76,
                "recommendedAction": "Open adjacent gates and redirect flow via signage and staff.",
                "estimatedImpact": "Improves throughput and safety margin",
                "classification": Classification.crowd.value,
            })

        busy_units = context.unit_status.get("busy", 0)
        if busy_units and busy_units >= context.unit_status.get("available", 0):
            recs.append({
                "title": "Rebalance response units",
                "explanation": f"{busy_units} unit(s) are occupied with limited availability.",
                "whyItMatters": "Thin coverage slows response to new incidents.",
                "confidence": 0.7,
                "recommendedAction": "Reassign idle units toward the highest-load sectors.",
                "estimatedImpact": "Restores response-time headroom",
                "classification": Classification.resource.value,
            })

        high_gates = [g for g in context.gate_status if g.wait_level in {"high", "medium"}]
        if high_gates:
            recs.append({
                "title": "Ease gate wait times",
                "explanation": f"{len(high_gates)} gate(s) reporting elevated wait levels.",
                "whyItMatters": "Long entry queues degrade the fan experience and bunch crowds outside.",
                "confidence": 0.72,
                "recommendedAction": "Add scanning lanes and steer arrivals to lower-traffic gates.",
                "estimatedImpact": "Shortens entry queues",
                "classification": Classification.transport.value,
            })

        if not recs:
            recs.append({
                "title": "Operations nominal",
                "explanation": "No critical signals detected in the current dashboard snapshot.",
                "whyItMatters": "Maintaining baseline monitoring keeps response readiness high.",
                "confidence": 0.9,
                "recommendedAction": "Continue standard monitoring cadence.",
                "estimatedImpact": "Sustains operational readiness",
                "classification": Classification.general.value,
            })
        return recs

    @staticmethod
    def _finalize(item: dict) -> CopilotRecommendation:
        return CopilotRecommendation.model_validate({
            **item,
            "id": str(uuid.uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "PENDING",
        })
