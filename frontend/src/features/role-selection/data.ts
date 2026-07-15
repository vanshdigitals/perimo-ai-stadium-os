import {
  Navigation,
  Activity,
  UtensilsCrossed,
  Accessibility,
  Languages,
  Bot,
  MapPinned,
  Users,
  ShieldCheck,
  Lock,
  HeartPulse,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface FeatureChip {
  label: string;
  icon: LucideIcon;
}

export const FEATURE_CHIPS: FeatureChip[] = [
  { label: 'AI Navigation', icon: Navigation },
  { label: 'Live Crowd Updates', icon: Activity },
  { label: 'Smart Food Finder', icon: UtensilsCrossed },
  { label: 'Accessibility', icon: Accessibility },
  { label: 'Multilingual Support', icon: Languages },
];

export type FloatingCardPosition =
  | 'top-left'
  | 'top-right'
  | 'mid-left'
  | 'bottom-left'
  | 'bottom-right';

export interface FloatingCardConfig {
  id: string;
  position: FloatingCardPosition;
  delay: number;
}

// Positions are expressed as percentages of the hero art container so the
// whole cluster scales down together at tablet, and disappears on mobile
// (see HeroSection) rather than being crammed onto a small screen.
export const FLOATING_CARD_POSITIONS: Record<FloatingCardPosition, string> = {
  'top-left': 'left-[2%] top-[6%]',
  'top-right': 'right-[0%] top-[2%]',
  'mid-left': 'left-[-4%] top-[42%]',
  'bottom-left': 'left-[8%] bottom-[4%]',
  'bottom-right': 'right-[4%] bottom-[10%]',
};

export interface OperationsRole {
  id: string;
  title: string;
  description: string;
  badgeText: string;
  buttonText: string;
  path: string;
  icon: LucideIcon;
  accent: 'green' | 'orange' | 'blue' | 'red';
  bullets: string[];
  isPrimary?: boolean;
  comingSoon?: boolean;
}

export const OPERATIONS_ROLES: OperationsRole[] = [
  {
    id: 'volunteer',
    title: 'Volunteer Operations',
    description: 'Manage volunteers, tasks, schedules and on-the-ground coordination.',
    badgeText: 'INVITE ONLY',
    buttonText: 'Volunteer Login',
    path: '/auth/volunteer/login',
    icon: Users,
    accent: 'green',
    bullets: ['Task Management', 'Shift Scheduling', 'Incident Reporting'],
  },
  {
    id: 'staff',
    title: 'Stadium Staff',
    description: 'Access operational tools, security systems and team communication.',
    badgeText: 'PRE-CREATED',
    buttonText: 'Staff Login',
    path: '/auth/staff/login',
    icon: ShieldCheck,
    accent: 'orange',
    bullets: ['Operations Dashboard', 'Team Communication', 'Security Systems'],
  },
  {
    id: 'admin',
    title: 'Command Center Administrator',
    description: 'Full command center access for administrators and operations managers.',
    badgeText: 'ENTERPRISE · RESTRICTED',
    buttonText: 'Admin Login',
    path: '/auth/admin/login',
    icon: Lock,
    accent: 'blue',
    bullets: ['Command Dashboard', 'System Monitoring', 'Analytics & Reports'],
    isPrimary: true,
  },
  {
    id: 'medical',
    title: 'Medical Operations',
    description: 'Medical team coordination, emergency response and health monitoring.',
    badgeText: 'COMING SOON',
    buttonText: 'Coming Soon',
    path: '',
    icon: HeartPulse,
    accent: 'red',
    bullets: ['Medical Dashboard', 'Emergency Response', 'Health Monitoring'],
    comingSoon: true,
  },
];

export interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const TRUST_ITEMS: TrustItem[] = [
  { icon: Shield, title: 'Secure & Trusted', description: 'Enterprise-grade security and data protection' },
  { icon: Languages, title: 'Multilingual Support', description: 'Available in 20+ languages for global visitors' },
  { icon: Accessibility, title: 'Accessibility First', description: 'Designed for everyone, everywhere' },
  { icon: Sparkles, title: 'AI Powered', description: 'Intelligent assistance for a seamless experience' },
];

export { MapPinned, Bot };
