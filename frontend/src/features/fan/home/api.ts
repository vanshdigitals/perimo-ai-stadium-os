import { apiClient } from '@/platform/api/client';

export interface MatchSummary {
  id: string;
  home: {
    id: string;
    name: string;
    short: string;
    crestUrl: string;
  };
  away: {
    id: string;
    name: string;
    short: string;
    crestUrl: string;
  };
  score: {
    home: number;
    away: number;
  } | null;
  minute: number | null;
  status: 'scheduled' | 'in_play' | 'paused' | 'finished';
  kickoffAt: string;
  venue: string;
}

export interface TicketPreview {
  id: string;
  matchId: string;
  qrToken: string;
  seat: {
    section: string;
    row: string;
    number: string;
    level: string;
  };
  gate: {
    name: string;
    level: string;
    zone: string;
  };
  status: 'valid' | 'used' | 'expired';
  gatesOpenAt: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  action: string;
  aiLabeled: boolean;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
}

export interface HomeOverview {
  greeting: {
    name: string;
    subtitle: string;
  };
  weather: {
    tempF: number;
    condition: string;
    icon: string;
  };
  ticketPreview: TicketPreview | null;
  status: {
    crowd: 'low' | 'moderate' | 'high';
    gate: string;
    transport: 'clear' | 'busy';
  };
  liveMatch: MatchSummary | null;
  quickActions: QuickAction[];
  recommendations: Recommendation[];
  schedule: ScheduleItem[];
}

export const fanHomeApi = {
  getOverview: (): Promise<HomeOverview> => {
    return apiClient.get('/fan/home');
  }
};
