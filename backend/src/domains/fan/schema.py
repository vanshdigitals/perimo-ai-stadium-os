from typing import Optional, List, Literal
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class MatchTeam(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    name: str
    short: str
    crestUrl: str

class MatchScore(BaseModel):
    model_config = ConfigDict(extra="forbid")
    home: int
    away: int

class MatchSummary(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    home: MatchTeam
    away: MatchTeam
    score: Optional[MatchScore]
    minute: Optional[int]
    status: Literal['scheduled', 'in_play', 'paused', 'finished']
    kickoffAt: datetime
    venue: str

class TicketSeat(BaseModel):
    model_config = ConfigDict(extra="forbid")
    section: str
    row: str
    number: str
    level: str

class TicketGate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    level: str
    zone: str

class TicketPreview(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    matchId: str
    qrToken: str
    seat: TicketSeat
    gate: TicketGate
    status: Literal['valid', 'used', 'expired']
    gatesOpenAt: datetime

class QuickAction(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    label: str
    icon: str
    path: str

class Recommendation(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    title: str
    reason: str
    action: str
    aiLabeled: bool

class ScheduleItem(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    time: str
    title: str

class Greeting(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    subtitle: str

class WeatherInfo(BaseModel):
    model_config = ConfigDict(extra="forbid")
    tempF: float
    condition: str
    icon: str

class StatusInfo(BaseModel):
    model_config = ConfigDict(extra="forbid")
    crowd: Literal['low', 'moderate', 'high']
    gate: str
    transport: Literal['clear', 'busy']

class HomeOverview(BaseModel):
    model_config = ConfigDict(extra="forbid")
    greeting: Greeting
    weather: WeatherInfo
    ticketPreview: Optional[TicketPreview]
    status: StatusInfo
    liveMatch: Optional[MatchSummary]
    quickActions: List[QuickAction]
    recommendations: List[Recommendation]
    schedule: List[ScheduleItem]
