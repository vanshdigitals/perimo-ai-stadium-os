from typing import Optional
from datetime import datetime, timezone
from src.domains.fan.schema import HomeOverview, Greeting, WeatherInfo, TicketPreview, TicketSeat, TicketGate, StatusInfo, QuickAction, Recommendation, ScheduleItem

class FanHomeService:
    def get_overview(self, user_id: str) -> HomeOverview:
        return HomeOverview(
            greeting=Greeting(name="Alex", subtitle="Welcome to the stadium!"),
            weather=WeatherInfo(tempF=72.0, condition="Clear", icon="sun"),
            ticketPreview=TicketPreview(
                id="tkt-123",
                matchId="match-123",
                qrToken="qr-token-mock",
                seat=TicketSeat(section="124", row="M", number="12", level="1"),
                gate=TicketGate(name="Gate A", level="1", zone="North"),
                status="valid",
                gatesOpenAt=datetime.now(timezone.utc)
            ),
            status=StatusInfo(crowd="low", gate="Flowing well", transport="clear"),
            liveMatch=None,
            quickActions=[
                QuickAction(id="qa1", label="Find seat", icon="map-pin", path="/fan/map"),
                QuickAction(id="qa2", label="Food", icon="coffee", path="/fan/food"),
                QuickAction(id="qa3", label="Emergency", icon="alert-circle", path="/fan/emergency"),
                QuickAction(id="qa4", label="Ask AI", icon="sparkles", path="/fan/ai")
            ],
            recommendations=[
                Recommendation(id="rec1", title="Head to Gate A", reason="Wait time is under 5 mins.", action="Navigate", aiLabeled=True)
            ],
            schedule=[
                ScheduleItem(id="sch1", time="17:00", title="Gates Open"),
                ScheduleItem(id="sch2", time="19:00", title="Kickoff")
            ]
        )
