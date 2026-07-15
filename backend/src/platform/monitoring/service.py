import logging
import psutil
import time

logger = logging.getLogger(__name__)

class MonitoringService:
    def __init__(self):
        self.start_time = time.time()

    def get_system_health(self):
        process = psutil.Process()
        return {
            "status": "healthy",
            "uptime_seconds": time.time() - self.start_time,
            "cpu_percent": psutil.cpu_percent(),
            "memory_mb": process.memory_info().rss / (1024 * 1024),
            "threads": process.num_threads()
        }

monitoring_service = MonitoringService()
