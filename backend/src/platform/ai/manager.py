import asyncio
import logging
import time
from typing import Any, Callable, Coroutine
from enum import Enum
from src.config.settings import get_settings

logger = logging.getLogger(__name__)

class CircuitState(Enum):
    CLOSED = "CLOSED"
    OPEN = "OPEN"
    HALF_OPEN = "HALF_OPEN"

class GeminiServiceManager:
    """Production-grade AI Service Manager with Circuit Breaker, Failover, Retry, and Health Monitoring."""
    
    def __init__(self, settings=None):
        if settings is None:
            settings = get_settings()
        self.primary_key = settings.gemini_api_key
        # Ensure fallback mechanism
        self.backup_key = getattr(settings, "backup_gemini_api_key", None)
        self.current_key = self.primary_key
        self.model_name = settings.gemini_model
        self.is_failover = False
        
        # Circuit Breaker state
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.failure_threshold = 3
        self.recovery_timeout = 30  # seconds before trying HALF_OPEN
        self.last_failure_time = 0
        
        self.model = None
        self._init_client(self.current_key)

    def _init_client(self, key: str | None):
        if key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=key)
                self.model = genai.GenerativeModel(self.model_name)
                logger.info("AI Service Manager initialized with Gemini model.")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
                self.model = None
                raise
        else:
            self.model = None

    async def _execute_with_backoff(self, coro: Callable[..., Coroutine], *args, **kwargs) -> Any:
        max_retries = 3
        base_delay = 1.0
        
        for attempt in range(max_retries):
            try:
                return await coro(*args, **kwargs)
            except Exception as e:
                logger.warning(f"AI Service attempt {attempt + 1} failed: {str(e)}")
                if attempt == max_retries - 1:
                    raise e
                await asyncio.sleep(base_delay * (2 ** attempt))

    def _trigger_failover(self):
        if not self.is_failover and self.backup_key:
            logger.error("AI Service triggering automatic failover to backup API.")
            self.is_failover = True
            self.current_key = self.backup_key
            self._init_client(self.current_key)
            self.state = CircuitState.CLOSED
            self.failure_count = 0
        else:
            logger.error("AI Service failover failed: Backup API already in use or unavailable.")
            self.state = CircuitState.OPEN

    def _recover(self):
        logger.info("AI Service recovering to primary API.")
        self.is_failover = False
        self.current_key = self.primary_key
        self._init_client(self.current_key)
        self.state = CircuitState.CLOSED
        self.failure_count = 0

    def check_health(self) -> dict[str, Any]:
        return {
            "status": "healthy" if self.state == CircuitState.CLOSED else ("degraded" if self.state == CircuitState.HALF_OPEN else "failing"),
            "circuit_state": self.state.value,
            "using_backup": self.is_failover,
            "failure_count": self.failure_count
        }

    async def generate_content(self, prompt: str, **kwargs) -> str:
        if not self.model:
            logger.warning("Mocking AI response because no API key is provided.")
            return "Mock AI Response due to missing API key. (Configure Gemini API Key for real responses)"

        # Circuit breaker logic
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                logger.info("Circuit breaker entering HALF_OPEN state.")
                self.state = CircuitState.HALF_OPEN
            else:
                if not self.is_failover and self.backup_key:
                    self._trigger_failover()
                else:
                    raise RuntimeError("AI Service circuit is OPEN and backup failed.")

        try:
            logger.info(f"Generating AI content (Failover: {self.is_failover})")
            response = await self._execute_with_backoff(self.model.generate_content_async, prompt, **kwargs)
            
            # Success in HALF_OPEN means recovery
            if self.state == CircuitState.HALF_OPEN:
                logger.info("Circuit breaker closed after successful test request.")
                self.state = CircuitState.CLOSED
                self.failure_count = 0
                
            return response.text
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()
            logger.error(f"AI Service error: {str(e)}")
            
            if self.failure_count >= self.failure_threshold:
                logger.error("Circuit breaker tripped. Opening circuit.")
                self.state = CircuitState.OPEN
                
            raise

ai_manager = GeminiServiceManager()
