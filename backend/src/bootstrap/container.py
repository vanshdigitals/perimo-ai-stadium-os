"""Composition root — wires stores, repositories, and services for the app.

Called once by the app factory. Keeps ``main.py`` thin and gives tests a single
place to build a fully-wired object graph over any :class:`DocumentStore`.
"""

from __future__ import annotations

from dataclasses import dataclass

from src.config.logging import get_logger
from src.config.settings import Settings
from src.domains.crowd.repository import CrowdMetaRepository, CrowdZoneRepository
from src.domains.crowd.service import CrowdService
from src.domains.facilities.repository import (
    FacilitySystemsRepository,
    MaintenanceRepository,
)
from src.domains.facilities.service import FacilitiesService
from src.domains.incidents.repository import IncidentMetaRepository, IncidentRepository
from src.domains.incidents.service import IncidentService
from src.domains.notifications.repository import (
    NotificationMetaRepository,
    NotificationRepository,
)
from src.domains.notifications.service import NotificationService
from src.domains.resources.repository import ResourceRepository
from src.domains.resources.service import ResourceService
from src.domains.transportation.repository import (
    ParkingRepository,
    RoadRepository,
    ShuttleRepository,
    TransitEventRepository,
    TransportInsightRepository,
    TransportSummaryRepository,
)
from src.domains.transportation.service import TransportService
from src.domains.live_ops.repository import (
    CrowdZoneBarRepository,
    EventFeedRepository,
    LiveOpsInsightRepository,
    LiveOpsSummaryRepository,
    OperatorLogRepository,
    SystemsRepository,
)
from src.domains.live_ops.service import LiveOpsService
from src.domains.fan.home.service import FanHomeService
from src.domains.copilot.service import CopilotService
from src.platform.eventbus.bus import EventBus
from src.platform.firestore.store import DocumentStore, build_store
from src.security.auth.passwords import hash_password
from src.security.auth.repository import SessionRepository, UserRepository
from src.security.auth.schemas import User, UserRole, UserStatus
from src.security.auth.service import AuthService

logger = get_logger(__name__)


@dataclass
class Container:
    """Fully-wired service graph attached to ``app.state``."""

    store: DocumentStore
    event_bus: EventBus
    auth_service: AuthService
    facilities_service: FacilitiesService
    crowd_service: CrowdService
    incident_service: IncidentService
    notification_service: NotificationService
    resource_service: ResourceService
    transport_service: TransportService
    live_ops_service: LiveOpsService
    fan_home_service: FanHomeService
    copilot_service: CopilotService


# Non-admin demo operators, so every role in the stadium (fan/volunteer/staff)
# can obtain a real backend token. Passwords are demo-only and clearly marked;
# override or remove for production. MFA is disabled for these so the fan/staff
# login flows work in a single step, matching the "instant access" fan UX.
_DEMO_OPERATORS: tuple[tuple[str, str, str, UserRole], ...] = (
    ("usr_staff", "staff@perimo.io", "Staff Operator", UserRole.staff),
    ("usr_volunteer", "volunteer@perimo.io", "Volunteer Coordinator", UserRole.volunteer),
    ("usr_fan", "fan@perimo.io", "Stadium Fan", UserRole.fan),
)
_DEMO_PASSWORD = "Perimo!2026"


def _seed_users(settings: Settings, users: UserRepository) -> None:
    """Seed the admin plus one operator per non-admin role (idempotent)."""
    _seed_admin(settings, users)
    for uid, email, name, role in _DEMO_OPERATORS:
        if users.get_by_email(email) is not None:
            continue
        users.save(
            User(
                id=uid,
                email=email,
                display_name=name,
                role=role,
                status=UserStatus.active,
                password_hash=hash_password(_DEMO_PASSWORD),
                mfa_enabled=False,
            )
        )
        logger.info("Seeded %s user %s.", role.value, email)


def _seed_admin(settings: Settings, users: UserRepository) -> None:
    """Ensure the seed administrator exists so the existing login UI works.

    Idempotent: only creates the user if the email is not already present. The
    password hash is generated at runtime from config (never committed).
    """
    email = settings.seed_admin_email.strip().lower()
    if users.get_by_email(email) is not None:
        return
    users.save(
        User(
            id="usr_admin",
            email=email,
            display_name=settings.seed_admin_name,
            role=UserRole.admin,
            status=UserStatus.active,
            password_hash=hash_password(settings.seed_admin_password),
            mfa_enabled=True,
        )
    )
    logger.info("Seeded admin user %s.", email)


def build_container(settings: Settings) -> Container:
    store = build_store(settings)
    event_bus = EventBus()

    users = UserRepository(store)
    sessions = SessionRepository(store)
    _seed_users(settings, users)
    auth_service = AuthService(settings, users, sessions)

    facilities_service = FacilitiesService(
        FacilitySystemsRepository(store),
        MaintenanceRepository(store),
    )
    crowd_service = CrowdService(CrowdZoneRepository(store), CrowdMetaRepository(store))
    incident_service = IncidentService(IncidentRepository(store), IncidentMetaRepository(store), event_bus)
    notification_service = NotificationService(
        NotificationRepository(store), NotificationMetaRepository(store), event_bus
    )
    resource_service = ResourceService(ResourceRepository(store), event_bus)
    transport_service = TransportService(
        parking=ParkingRepository(store),
        shuttles=ShuttleRepository(store),
        roads=RoadRepository(store),
        events=TransitEventRepository(store),
        insights=TransportInsightRepository(store),
        summary_repo=TransportSummaryRepository(store),
    )
    live_ops_service = LiveOpsService(
        systems=SystemsRepository(store),
        crowd_zones=CrowdZoneBarRepository(store),
        events=EventFeedRepository(store),
        operator_log=OperatorLogRepository(store),
        insights=LiveOpsInsightRepository(store),
        summary_repo=LiveOpsSummaryRepository(store),
    )
    fan_home_service = FanHomeService()
    copilot_service = CopilotService()

    return Container(
        store=store,
        event_bus=event_bus,
        auth_service=auth_service,
        facilities_service=facilities_service,
        crowd_service=crowd_service,
        incident_service=incident_service,
        notification_service=notification_service,
        resource_service=resource_service,
        transport_service=transport_service,
        live_ops_service=live_ops_service,
        fan_home_service=fan_home_service,
        copilot_service=copilot_service,
    )
