import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  HandHelping, Users, ShieldCheck, LayoutDashboard, ArrowRight, Check, Lock,
  HeartPulse, RadioTower, Wrench, Shield, Flame, type LucideIcon,
} from 'lucide-react';
import { Header } from '@/components/layouts/Header';
import { ThemeToggle } from '@/features/role-selection/components/ThemeToggle';
import { usePageTheme } from '@/features/role-selection/hooks/usePageTheme';
import { cn } from '@/utils/cn';

const EASE = [0.16, 1, 0.3, 1] as const;

interface Role {
  id: string; name: string; icon: LucideIcon; accent: string;
  description: string; features: string[]; badge: string; cta: string; path: string;
}

const ROLES: Role[] = [
  { id: 'fan', name: 'Fan', icon: HandHelping, accent: '#2563EB', description: 'Your personal AI companion for navigation, food, tickets and safety inside the stadium.', features: ['AI wayfinding', 'Live crowd & transport', 'Smart food finder'], badge: 'OPEN ACCESS', cta: 'Enter as Fan', path: '/auth/fan/login' },
  { id: 'volunteer', name: 'Volunteer', icon: Users, accent: '#16A34A', description: 'Guided tasks, shift schedules and on-the-ground coordination for event volunteers.', features: ['Task management', 'Shift scheduling', 'Incident reporting'], badge: 'INVITE ONLY', cta: 'Volunteer Login', path: '/auth/volunteer/login' },
  { id: 'staff', name: 'Staff', icon: ShieldCheck, accent: '#D97706', description: 'Operational tools, gate control, incident response and secure team communication.', features: ['Operations dashboard', 'Gate & access control', 'Team radio'], badge: 'PRE-CREATED', cta: 'Staff Login', path: '/auth/staff/login' },
  { id: 'admin', name: 'Administrator', icon: LayoutDashboard, accent: '#6B4EFF', description: 'The command center — live digital twin, analytics and full operational oversight.', features: ['Command dashboard', 'Analytics & reports', 'System monitoring'], badge: 'ENTERPRISE · RESTRICTED', cta: 'Admin Login', path: '/auth/admin/login' },
];

const COMING_SOON: { name: string; icon: LucideIcon }[] = [
  { name: 'Medical Operations', icon: HeartPulse },
  { name: 'Broadcast Operations', icon: RadioTower },
  { name: 'Maintenance', icon: Wrench },
  { name: 'Police', icon: Shield },
  { name: 'Fire Response', icon: Flame },
];

const RoleCard: React.FC<{ role: Role; isDark: boolean; index: number; onSelect: () => void }> = ({ role, isDark, index, onSelect }) => {
  const reduce = useReducedMotion();
  const Icon = role.icon;
  return (
    <motion.button
      onClick={onSelect}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08, ease: EASE }}
      whileHover={reduce ? undefined : { y: -6 }}
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[20px] border p-6 text-left transition-shadow duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2',
        isDark ? 'border-[#1C2230] bg-[#111622] hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)]' : 'border-[#E8ECF1] bg-white hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.22)]',
      )}
    >
      {/* accent wash on hover */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: role.accent }} />

      <div className="flex items-center justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: `${role.accent}1a`, color: role.accent }}>
          <Icon className="h-7 w-7" strokeWidth={2} />
        </span>
        <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em]', isDark ? 'border-[#232838] text-[#8A93A3]' : 'border-[#E2E4E9] text-[#64748B]')}>
          {role.id === 'admin' && <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />}
          {role.badge}
        </span>
      </div>

      <h3 className={cn('mt-5 font-display text-[22px] font-semibold', isDark ? 'text-white' : 'text-[#0B0F19]')}>{role.name}</h3>
      <p className={cn('mt-2 text-[14px] leading-[1.6]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{role.description}</p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {role.features.map((f) => (
          <li key={f} className={cn('flex items-center gap-2.5 text-[13.5px]', isDark ? 'text-[#C7CDD6]' : 'text-[#334155]')}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: `${role.accent}1f`, color: role.accent }}>
              <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <span className="mt-6 flex items-center gap-1.5 text-[14px] font-semibold transition-colors" style={{ color: role.accent }}>
        {role.cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.5} />
      </span>
    </motion.button>
  );
};

export const GetStarted: React.FC = () => {
  const navigate = useNavigate();
  const { isDark, toggle } = usePageTheme();
  const reduce = useReducedMotion();

  return (
    <div className={isDark ? 'min-h-screen bg-[#0A0E14]' : 'min-h-screen bg-white'}>
      <Header theme={isDark ? 'dark' : 'light'} themeToggle={<ThemeToggle isDark={isDark} onToggle={toggle} />} />

      <main className="relative overflow-hidden">
        <div aria-hidden className={cn('pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl', isDark ? 'bg-[#2563EB]/[0.12]' : 'bg-[#2563EB]/[0.06]')} />

        <div className="relative mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
          {/* Center hero */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto max-w-[680px] text-center"
          >
            <span className={cn('inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold', isDark ? 'border-[#232838] bg-[#141822] text-[#7CA6FF]' : 'border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#2563EB]')}>
              Choose your role
            </span>
            <h1 className={cn('mt-6 font-display text-[clamp(34px,5vw,52px)] font-semibold leading-[1.06] tracking-[-0.02em]', isDark ? 'text-white' : 'text-[#0B0F19]')}>
              Choose Your Experience
            </h1>
            <p className={cn('mx-auto mt-4 max-w-[520px] text-[16.5px] leading-[1.65]', isDark ? 'text-[#9AA3B2]' : 'text-[#5B6472]')}>
              Select the role that best matches your stadium experience.
            </p>
          </motion.div>

          {/* 4 role cards */}
          <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ROLES.map((role, i) => (
              <RoleCard key={role.id} role={role} isDark={isDark} index={i} onSelect={() => navigate(role.path)} />
            ))}
          </div>

          {/* Coming soon */}
          <div className="mt-20">
            <div className="text-center">
              <h2 className={cn('font-display text-[22px] font-semibold', isDark ? 'text-white' : 'text-[#0B0F19]')}>More modules on the way</h2>
              <p className={cn('mt-2 text-[14.5px]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>Specialized operations experiences currently in development.</p>
            </div>
            <div className="mx-auto mt-8 flex max-w-[900px] flex-wrap items-center justify-center gap-3">
              {COMING_SOON.map((m) => (
                <div
                  key={m.name}
                  className={cn(
                    'inline-flex cursor-not-allowed items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13.5px] font-medium opacity-60 select-none',
                    isDark ? 'border-[#1C2230] bg-[#0E121B] text-[#6B7688]' : 'border-[#E8ECF1] bg-[#F8FAFC] text-[#94A3B8]',
                  )}
                  aria-disabled="true"
                >
                  <m.icon className="h-4 w-4" strokeWidth={2} />
                  {m.name}
                  <span className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', isDark ? 'bg-[#1C2230] text-[#6B7688]' : 'bg-[#E2E4E9] text-[#94A3B8]')}>Soon</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
