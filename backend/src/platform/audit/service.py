import logging
import json
from src.platform.eventbus.bus import DomainEvent, EventBus

logger = logging.getLogger(__name__)

class AuditLogService:
    def __init__(self):
        self.logs = []

    async def handle_event(self, event: DomainEvent):
        log_entry = {
            "timestamp": event.occurred_at,
            "event_type": event.event_type,
            "actor_id": getattr(event, "actor_id", "system"),
            "payload": event.payload,
        }
        self.logs.append(log_entry)
        # Limit in-memory logs for this exercise
        if len(self.logs) > 1000:
            self.logs.pop(0)
        logger.info(f"AUDIT LOG: {event.event_type} by {log_entry['actor_id']}")

    def get_logs(self, limit: int = 100):
        return self.logs[-limit:]

audit_service = AuditLogService()

def wire_audit(event_bus: EventBus):
    # Subscribe to all events using a catch-all if possible,
    # or subscribe to known prefixes.
    prefixes = ["incident", "crowd", "resource", "transport", "twin", "notification", "system", "ai"]
    for prefix in prefixes:
        event_bus.subscribe(prefix, audit_service.handle_event)
