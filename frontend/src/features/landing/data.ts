import {
  Navigation, ShieldCheck, Bot, Activity, CloudSun, Accessibility, Bus,
  Radar, MapPinned, MessageSquareText, Siren, Users, LayoutDashboard,
  HandHelping, Sparkles, Lock, Gauge, Languages, type LucideIcon,
} from 'lucide-react';

/** Hero floating context cards (rendered around the illustration). */
export interface HeroCard {
  id: string;
  icon: LucideIcon;
  title: string;
  detail: string;
  tint: string; // icon container classes
  position: string;
  tabletHidden?: boolean;
  scale?: number;
  floatOffset: number;
  delay: number;
}

export const HERO_CARDS: HeroCard[] = [
  // Top center
  { id: 'nav', icon: Navigation, title: 'AI Navigation', detail: 'Seat 125 · 4 min', tint: 'bg-[#2563EB]/15 text-[#2563EB]', position: 'top-[-2%] left-[30%]', tabletHidden: true, scale: 0.95, floatOffset: 1, delay: 0.25 },
  // Top left
  { id: 'crowd', icon: Activity, title: 'Live Crowd', detail: 'Gate C · Moderate', tint: 'bg-[#F59E0B]/15 text-[#D97706]', position: 'top-[16%] left-[-8%]', scale: 1.05, floatOffset: 0.5, delay: 0.3 },
  // Top right
  { id: 'weather', icon: CloudSun, title: 'Weather Alerts', detail: 'Clear · 72°F', tint: 'bg-[#0EA5E9]/15 text-[#0EA5E9]', position: 'top-[22%] right-[-6%]', scale: 0.9, floatOffset: 1.5, delay: 0.35 },
  // Bottom left
  { id: 'gates', icon: Radar, title: 'Gate Status', detail: 'Gate A · Flowing', tint: 'bg-[#6B4EFF]/15 text-[#6B4EFF]', position: 'bottom-[24%] left-[-6%]', scale: 0.95, floatOffset: 2.2, delay: 0.4 },
  // Bottom right
  { id: 'safety', icon: ShieldCheck, title: 'Emergency Ready', detail: 'All clear · LOW', tint: 'bg-[#16A34A]/15 text-[#16A34A]', position: 'bottom-[18%] right-[-10%]', scale: 1.1, floatOffset: 3, delay: 0.45 },
  // Bottom center
  { id: 'food', icon: Bus, title: 'Transport', detail: 'Shuttle · 2 min', tint: 'bg-[#EC4899]/15 text-[#EC4899]', position: 'bottom-[-6%] right-[30%]', tabletHidden: true, scale: 0.85, floatOffset: 2.5, delay: 0.5 },
];

/** "Why PERIMO" value pillars. */
export interface Pillar { icon: LucideIcon; title: string; body: string; }
export const PILLARS: Pillar[] = [
  { icon: Radar, title: 'Real-time intelligence', body: 'Every gate, zone and asset streamed live — crowd density, incidents and system health in one operating picture. This unified data layer eliminates operational blind spots.' },
  { icon: Bot, title: 'AI that recommends, never guesses', body: 'Grounded recommendations from verified operational data. The AI advises; your team decides. Every insight is traceable back to the source.' },
  { icon: ShieldCheck, title: 'Safety by design', body: 'Incident lifecycle, emergency protocols and lockdown controls built for the moments that matter most. Integrated directly with local emergency response services.' },
  { icon: Accessibility, title: 'Accessible to everyone', body: 'Step-free routing, screen-reader-ready flows and 20+ languages, for fans and operators alike. Ensure inclusivity without compromising speed.' },
];

/** Platform ecosystem roles. */
export interface EcosystemRole { icon: LucideIcon; name: string; blurb: string; accent: string; hash: string; }
export const ECOSYSTEM: EcosystemRole[] = [
  { icon: HandHelping, name: 'Fan', blurb: 'A personal AI companion for wayfinding, food, tickets and safety. Elevate the matchday experience from arrival to departure.', accent: '#2563EB', hash: 'fan' },
  { icon: Users, name: 'Volunteer', blurb: 'Guided tasks, shift schedules and on-the-ground coordination. Ensure every team member knows exactly where they are needed most.', accent: '#16A34A', hash: 'volunteer' },
  { icon: ShieldCheck, name: 'Staff', blurb: 'Operations tools, gate control, incident response and team radio. Equip your ground force with real-time, actionable intelligence.', accent: '#D97706', hash: 'staff' },
  { icon: LayoutDashboard, name: 'Administrator', blurb: 'The command center — live twin, analytics and full oversight. Maintain complete systemic control over the entire stadium ecosystem.', accent: '#6B4EFF', hash: 'command-center' },
];

/** AI capabilities. */
export interface Capability { icon: LucideIcon; title: string; body: string; }
export const CAPABILITIES: Capability[] = [
  { icon: MapPinned, title: 'Predictive navigation', body: 'Least-congested, step-free routes recalculated as crowds shift. Guiding users dynamically away from emerging bottlenecks.' },
  { icon: Activity, title: 'Crowd forecasting', body: 'Surge prediction per zone so teams act before a bottleneck forms. AI models analyze historical and live ingress rates.' },
  { icon: Siren, title: 'Incident intelligence', body: 'Auto-triage, severity scoring and the nearest available response unit. Dramatically reduce resolution times for critical events.' },
  { icon: MessageSquareText, title: 'Conversational assistant', body: 'Ask anything in natural language — grounded in verified stadium data. Provides instant, accurate answers for all stakeholders.' },
  { icon: CloudSun, title: 'Weather-aware operations', body: 'Transport and comfort guidance that adapts to changing conditions. Seamlessly reroute traffic during sudden environmental shifts.' },
  { icon: Bus, title: 'Transport orchestration', body: 'Live parking, shuttle ETAs and departure flow management. Synchronize massive ingress and egress operations with ease.' },
];

/** How it works — 3 steps. */
export interface Step { n: string; title: string; body: string; }
export const STEPS: Step[] = [
  { n: '01', title: 'Connect the venue', body: 'PERIMO ingests gates, sensors, cameras and schedules into one live operating model of the stadium.' },
  { n: '02', title: 'Intelligence goes live', body: 'The AI layer forecasts crowds, triages incidents and streams recommendations in real time.' },
  { n: '03', title: 'Everyone stays in sync', body: 'Fans, volunteers, staff and administrators act on the same trusted picture, on any device.' },
];

/** Security assurances. */
export const SECURITY: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Lock, title: 'Encrypted end to end', body: 'JWT-secured sessions, role-based access and TLS everywhere.' },
  { icon: Gauge, title: 'Built to scale', body: 'Cloud-native services designed for match-day peak loads.' },
  { icon: Sparkles, title: 'Transparent AI', body: 'Every AI recommendation is labelled, explained and never auto-executed.' },
  { icon: Languages, title: 'Global by default', body: 'Localized experiences for a worldwide audience.' },
];

/** Headline statistics. */
export const STATS: { value: string; label: string }[] = [
  { value: '82,500', label: 'Fans per venue' },
  { value: '<2 s', label: 'Live update latency' },
  { value: '20+', label: 'Languages supported' },
  { value: '99.9%', label: 'Operational uptime target' },
];

/** FAQ. */
export const FAQS: { q: string; a: string }[] = [
  { q: 'What exactly is PERIMO?', a: 'PERIMO is an AI Stadium Operating System — one platform that connects fans, volunteers, staff and administrators around a single real-time picture of the venue.' },
  { q: 'Does the AI make decisions on its own?', a: 'No. The AI resolves facts from verified operational data and recommends actions. Every recommendation is labelled and requires a human to act on it.' },
  { q: 'Is it built for large events like the FIFA World Cup 2026?', a: 'Yes. PERIMO is designed for global tournament operations — multi-venue, multilingual, and engineered for match-day peak loads.' },
  { q: 'How accessible is the fan experience?', a: 'Accessibility is a first-class concern: step-free routing, screen-reader-ready flows, high-contrast modes and 20+ languages.' },
  { q: 'What does it take to get started?', a: 'Choose your role to sign in. Fans get instant access; volunteers, staff and administrators use credentials issued by their organization.' },
];

/** Footer navigation. */
export const FOOTER_COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Platform', links: ['Command Center', 'Digital Twin', 'Crowd Intelligence', 'Incident Response'] },
  { title: 'Solutions', links: ['Stadiums', 'Tournaments', 'Transit Hubs', 'Live Events'] },
  { title: 'Developers', links: ['API Reference', 'WebSocket Events', 'Design System', 'Status'] },
  { title: 'Resources', links: ['Documentation', 'Guides', 'Changelog', 'Support'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Accessibility'] },
];

export const NAV_LINKS: { label: string; target: string }[] = [
  { label: 'Platform', target: 'platform' },
  { label: 'AI', target: 'ai' },
  { label: 'Security', target: 'security' },
  { label: 'FAQ', target: 'faq' },
];
