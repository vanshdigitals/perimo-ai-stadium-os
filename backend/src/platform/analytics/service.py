import logging
import time
from collections import defaultdict
from src.platform.eventbus.bus import DomainEvent, EventBus

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self):
        self.metrics = defaultdict(int)
        self.start_time = time.time()

    async def handle_event(self, event: DomainEvent):
        # Update metrics based on event type
        self.metrics["total_events"] += 1
        self.metrics[f"event_{event.event_type}"] += 1
        
        # Specific business metrics
        if event.event_type == "incident.updated":
            if event.payload.get("status") == "Resolved":
                self.metrics["incidents_resolved"] += 1
            else:
                self.metrics["incidents_created_or_updated"] += 1
                
        elif event.event_type == "crowd.level_changed":
            if event.payload.get("level") == "Critical":
                self.metrics["critical_crowd_events"] += 1

    def get_analytics(self):
        return {
            "uptime_seconds": time.time() - self.start_time,
            "metrics": dict(self.metrics)
        }

analytics_service = AnalyticsService()

def wire_analytics(event_bus: EventBus):
    prefixes = ["incident", "crowd", "resource", "transport", "twin", "notification", "system", "ai"]
    for prefix in prefixes:
        event_bus.subscribe(prefix, analytics_service.handle_event)
