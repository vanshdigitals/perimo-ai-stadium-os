import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronRight, Sparkles, Shirt } from 'lucide-react';
import { cn } from '@/utils/cn';
import { QUICK_ACTIONS, LIVE_CARDS, TIMELINE, NOTIFICATIONS, RECOMMENDED_FOOD, MERCH, type LiveCard } from './data';

const EASE = [0.16, 1, 0.3, 1] as const;

const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
};

const SectionHeader: React.FC<{ title: string; action?: string; isDark: boolean }> = ({ title, action, isDark }) => (
  <div className="mb-4 flex items-center justify-between">
    <h2 className={cn('font-display text-[19px] font-semibold tracking-[-0.01em]', isDark ? 'text-white' : 'text-[#0B0F19]')}>{title}</h2>
    {action && (
      <button className={cn('flex items-center gap-0.5 text-[13px] font-semibold', isDark ? 'text-[#7CA6FF]' : 'text-[#2563EB]')}>
        {action} <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    )}
  </div>
);

const TONE: Record<LiveCard['tone'], { chip: string; dot: string }> = {
  success: { chip: 'bg-[#16A34A]/10 text-[#15803D]', dot: 'bg-[#16A34A]' },
  warning: { chip: 'bg-[#F59E0B]/12 text-[#B45309]', dot: 'bg-[#D97706]' },
  danger: { chip: 'bg-[#EF4444]/10 text-[#B91C1C]', dot: 'bg-[#EF4444]' },
  info: { chip: 'bg-[#0EA5E9]/10 text-[#0369A1]', dot: 'bg-[#0EA5E9]' },
  ai: { chip: 'bg-[#6B4EFF]/10 text-[#6B4EFF]', dot: 'bg-[#6B4EFF]' },
};

const Spark: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const w = 72, h = 26, min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(' ');
  const last = data.length ? { x: w, y: h - ((data[data.length - 1] - min) / range) * (h - 4) - 2 } : null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      {last && <circle cx={last.x} cy={last.y} r="2" fill={color} />}
    </svg>
  );
};

const cardBase = (isDark: boolean, hover = true) => cn(
  'rounded-2xl border transition-all duration-200',
  isDark ? 'border-[#1C2230] bg-[#111622]' : 'border-[#E8ECF1] bg-white',
  hover && (isDark ? 'hover:border-[#2A3346]' : 'hover:border-[#CBD5E1] hover:shadow-[0_16px_40px_-16px_rgba(15,23,42,0.16)]'),
);

// ── Quick Actions ───────────────────────────────────────────────────────────
export const QuickActions: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const reduce = useReducedMotion();
  return (
    <section>
      <SectionHeader title="Quick Actions" isDark={isDark} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-9 lg:gap-4">
        {QUICK_ACTIONS.map((a, i) => (
          <motion.button
            key={a.id}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: (i % 9) * 0.04, ease: EASE }}
            whileHover={reduce ? undefined : { y: -4 }}
            className={cn('group flex flex-col items-center justify-center gap-2.5 rounded-2xl border px-2 py-4 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]', cardBase(isDark))}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110" style={{ backgroundColor: `${a.accent}15`, color: a.accent }}>
              <a.icon className="h-[22px] w-[22px]" strokeWidth={2} />
            </span>
            <span className={cn('text-center text-[12px] font-semibold leading-tight', isDark ? 'text-[#C7CDD6]' : 'text-[#334155]')}>{a.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

// ── Live Cards ──────────────────────────────────────────────────────────────
export const LiveCards: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <section>
    <SectionHeader title="Live Information" action="Refresh" isDark={isDark} />
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
      {LIVE_CARDS.map((c, i) => {
        const t = TONE[c.tone];
        const accent = c.tone === 'ai' ? '#6B4EFF' : c.tone === 'success' ? '#16A34A' : c.tone === 'warning' ? '#D97706' : c.tone === 'danger' ? '#EF4444' : '#0EA5E9';
        return (
          <Reveal key={c.id} delay={(i % 3) * 0.05}>
            <div className={cn('h-full p-5', cardBase(isDark), c.tone === 'ai' && (isDark ? 'ring-1 ring-[#6B4EFF]/25' : 'bg-gradient-to-br from-[#6B4EFF]/[0.04] to-transparent'))}>
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${accent}15`, color: accent }}>
                  <c.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                {c.spark ? <Spark data={c.spark} color={accent} /> : (
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide', t.chip)}>
                    <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} /> {c.tone === 'ai' ? 'AI' : 'Live'}
                  </span>
                )}
              </div>
              <div className={cn('mt-4 text-[12px] font-semibold uppercase tracking-[0.06em]', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>{c.title}</div>
              <div className={cn('mt-0.5 text-[19px] font-bold leading-tight', isDark ? 'text-white' : 'text-[#0F172A]')}>{c.value}</div>
              <div className={cn('mt-1.5 flex items-center gap-1.5 text-[13px] leading-snug', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>
                {c.tone === 'ai' && <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#6B4EFF]" />} {c.sub}
              </div>
            </div>
          </Reveal>
        );
      })}
    </div>
  </section>
);

// ── Bottom sections ─────────────────────────────────────────────────────────
const TIMELINE_TONE: Record<string, string> = { brand: '#2563EB', success: '#16A34A', muted: '#94A3B8' };

export const BottomSections: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-6">
    {/* Timeline (spans 2) */}
    <div className="lg:col-span-2">
      <SectionHeader title="Today's Timeline" isDark={isDark} />
      <div className={cn('p-2', cardBase(isDark, false))}>
        {TIMELINE.map((item, i) => (
          <div key={item.time} className={cn('flex items-start gap-4 p-3.5', i !== TIMELINE.length - 1 && (isDark ? 'border-b border-[#1C2230]' : 'border-b border-[#F1F5F9]'))}>
            <div className="flex flex-col items-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${TIMELINE_TONE[item.tone]}15`, color: TIMELINE_TONE[item.tone] }}>
                <item.icon className="h-5 w-5" strokeWidth={2} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn('font-mono text-[13px] font-bold tabular-nums', isDark ? 'text-white' : 'text-[#0F172A]')}>{item.time}</span>
                <span className={cn('text-[14px] font-semibold', isDark ? 'text-[#E5E9F0]' : 'text-[#0F172A]')}>{item.title}</span>
              </div>
              <p className={cn('mt-0.5 text-[13px]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended food */}
      <div className="mt-6">
        <SectionHeader title="Recommended Food" action="See all" isDark={isDark} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RECOMMENDED_FOOD.map((f) => (
            <div key={f.id} className={cn('p-4', cardBase(isDark))}>
              <div className={cn('flex h-24 items-center justify-center rounded-xl bg-gradient-to-br', isDark ? 'from-[#1C2230] to-[#151A24]' : 'from-[#F1F5F9] to-[#E8ECF1]')}>
                <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: isDark ? '#6B7688' : '#94A3B8' }}>{f.tag}</span>
              </div>
              <div className={cn('mt-3 text-[14px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{f.name}</div>
              <div className={cn('mt-0.5 text-[12px]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{f.vendor}</div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="rounded-full bg-[#16A34A]/10 px-2 py-0.5 text-[11px] font-bold text-[#15803D]">{f.wait} wait</span>
                <span className={cn('text-[14px] font-bold', isDark ? 'text-white' : 'text-[#0F172A]')}>{f.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Right column: notifications + merch */}
    <div className="flex flex-col gap-6">
      <div>
        <SectionHeader title="Recent Notifications" isDark={isDark} />
        <div className={cn('divide-y', isDark ? 'divide-[#1C2230]' : 'divide-[#F1F5F9]', cardBase(isDark, false))}>
          {NOTIFICATIONS.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-4">
              <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.tone === 'critical' ? 'bg-[#EF4444]' : n.tone === 'success' ? 'bg-[#16A34A]' : 'bg-[#2563EB]')} />
              <div className="min-w-0 flex-1">
                <p className={cn('text-[13.5px] font-medium leading-snug', isDark ? 'text-[#E5E9F0]' : 'text-[#334155]')}>{n.title}</p>
                <span className={cn('text-[11.5px] font-medium', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>{n.time} ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Merchandise" action="Shop" isDark={isDark} />
        <div className={cn('flex flex-col', cardBase(isDark, false))}>
          {MERCH.map((m, i) => (
            <div key={m.id} className={cn('flex items-center gap-3 p-3.5', i !== MERCH.length - 1 && (isDark ? 'border-b border-[#1C2230]' : 'border-b border-[#F1F5F9]'))}>
              <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[#2563EB]', isDark ? 'from-[#1C2230] to-[#151A24]' : 'from-[#EFF3FF] to-[#E8ECF1]')}>
                <Shirt className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn('truncate text-[13.5px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{m.name}</p>
              </div>
              <span className="text-[14px] font-bold text-[#2563EB]">{m.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
