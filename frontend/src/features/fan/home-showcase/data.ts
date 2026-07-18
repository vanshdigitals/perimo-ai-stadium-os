import {
  Ticket, Navigation, UtensilsCrossed, Toilet, Car, ShieldAlert, ShoppingBag,
  Radio, HeartPulse, Users, Bus, ShieldCheck, CloudSun, Sparkles, Bell,
  Trophy, Flag, type LucideIcon,
} from 'lucide-react';

/** Match / ticket context — the fan's "right now". */
export const MATCH = {
  competition: 'FIFA World Cup 2026',
  stage: 'Final',
  venue: 'MetLife Stadium · New York',
  home: { name: 'Argentina', short: 'ARG', flag: '🇦🇷' },
  away: { name: 'France', short: 'FRA', flag: '🇫🇷' },
  kickoffLabel: 'Today · 20:00',
  // kickoff = now + 1h 15m 42s so the countdown ticks live in the demo
  kickoffOffsetMs: (1 * 3600 + 15 * 60 + 42) * 1000,
};

export const TICKET = {
  gate: 'Gate C',
  section: 'Sec 114',
  seat: 'Row 12 · Seat 24',
  status: 'Valid',
};

export const CONDITIONS = {
  weather: { tempF: 72, condition: 'Clear', icon: CloudSun },
  crowd: { label: 'Moderate', pct: 64, tone: 'warning' as const },
  parking: { label: 'Lot P2 · 78%', tone: 'warning' as const },
};

export interface QuickAction { id: string; label: string; icon: LucideIcon; accent: string; }
export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'ticket', label: 'Digital Ticket', icon: Ticket, accent: '#2563EB' },
  { id: 'navigate', label: 'Navigate', icon: Navigation, accent: '#6B4EFF' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, accent: '#EA580C' },
  { id: 'restrooms', label: 'Restrooms', icon: Toilet, accent: '#0EA5E9' },
  { id: 'parking', label: 'Parking', icon: Car, accent: '#0891B2' },
  { id: 'emergency', label: 'Emergency', icon: ShieldAlert, accent: '#DC2626' },
  { id: 'store', label: 'Store', icon: ShoppingBag, accent: '#DB2777' },
  { id: 'match', label: 'Live Match', icon: Radio, accent: '#16A34A' },
  { id: 'medical', label: 'Medical', icon: HeartPulse, accent: '#E11D48' },
];

export interface LiveCard {
  id: string; title: string; icon: LucideIcon; value: string; sub: string;
  tone: 'success' | 'warning' | 'danger' | 'info' | 'ai';
  spark?: number[];
}
export const LIVE_CARDS: LiveCard[] = [
  { id: 'crowd', title: 'Crowd Density', icon: Users, value: 'Moderate', sub: 'Concourse B filling · +6% / 10m', tone: 'warning', spark: [40, 44, 48, 52, 58, 61, 64] },
  { id: 'transport', title: 'Transport', icon: Bus, value: 'On time', sub: 'Shuttle · next in 2 min', tone: 'success', spark: [8, 6, 5, 4, 3, 2, 2] },
  { id: 'security', title: 'Security', icon: ShieldCheck, value: 'All clear', sub: 'Threat level · LOW', tone: 'success' },
  { id: 'weather', title: 'Weather', icon: CloudSun, value: '72°F Clear', sub: 'No alerts · light breeze', tone: 'info' },
  { id: 'emergency', title: 'Emergency Status', icon: ShieldAlert, value: 'Normal', sub: 'Nearest exit · Gate C · 40m', tone: 'success' },
  { id: 'ai', title: 'AI Recommendation', icon: Sparkles, value: 'Leave at 19:20', sub: 'Beat the Gate C rush — step-free route ready', tone: 'ai' },
];

export interface TimelineItem { time: string; title: string; detail: string; icon: LucideIcon; tone: 'brand' | 'muted' | 'success'; }
export const TIMELINE: TimelineItem[] = [
  { time: '19:15', title: 'Gates open', detail: 'Gate C now admitting · scan at turnstile', icon: Flag, tone: 'brand' },
  { time: '19:45', title: 'Team walkout', detail: 'Players enter the pitch', icon: Users, tone: 'muted' },
  { time: '20:00', title: 'Kickoff', detail: 'Argentina vs France · Final', icon: Trophy, tone: 'success' },
  { time: '20:45', title: 'Half-time', detail: 'Concessions & restrooms — beat the queue', icon: UtensilsCrossed, tone: 'muted' },
];

export interface NotificationItem { id: string; title: string; time: string; tone: 'critical' | 'info' | 'success'; }
export const NOTIFICATIONS: NotificationItem[] = [
  { id: 'n1', title: 'Your gate is now open — Gate C', time: '2m', tone: 'success' },
  { id: 'n2', title: 'Light crowd building near Concourse B', time: '11m', tone: 'info' },
  { id: 'n3', title: 'Half-time meal pre-orders close at 20:30', time: '18m', tone: 'info' },
];

export interface FoodItem { id: string; name: string; vendor: string; wait: string; price: string; tag: string; }
export const RECOMMENDED_FOOD: FoodItem[] = [
  { id: 'f1', name: 'Halal Smash Burger', vendor: 'Concourse B · Kiosk 4', wait: '5 min', price: '$12', tag: 'Halal' },
  { id: 'f2', name: 'Loaded Nachos', vendor: 'Gate C · Food Hall', wait: '8 min', price: '$9', tag: 'Veg' },
  { id: 'f3', name: 'Cold Brew Coffee', vendor: 'Level 1 · Cart 12', wait: '3 min', price: '$6', tag: 'Fast' },
];

export interface MerchItem { id: string; name: string; price: string; }
export const MERCH: MerchItem[] = [
  { id: 'm1', name: 'Argentina 2026 Home Jersey', price: '$89' },
  { id: 'm2', name: 'World Cup Final Scarf', price: '$29' },
  { id: 'm3', name: 'Commemorative Match Cap', price: '$34' },
];

export { Bell };
