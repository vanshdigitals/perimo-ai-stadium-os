import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { QrCode, ChevronRight, MapPin, Ticket as TicketIcon, CloudSun, Users, Car } from 'lucide-react';
import { cn } from '@/utils/cn';
import stadiumLight from '@/assets/stadium-light.png';
import stadiumDark from '@/assets/stadium-dark.png';
import { MATCH, TICKET, CONDITIONS } from './data';

const EASE = [0.16, 1, 0.3, 1] as const;

function useCountdown(offsetMs: number) {
  const [target] = useState(() => Date.now() + offsetMs);
  const [remaining, setRemaining] = useState(offsetMs);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [target]);
  const h = Math.floor(remaining / 3_600_000);
  const m = Math.floor((remaining % 3_600_000) / 60_000);
  const s = Math.floor((remaining % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { h: pad(h), m: pad(m), s: pad(s) };
}

const StatPill: React.FC<{ icon: typeof CloudSun; label: string; value: string; isDark: boolean; tone?: 'default' | 'warning' }> = ({ icon: Icon, label, value, isDark, tone = 'default' }) => (
  <div className={cn('flex items-center gap-2.5 rounded-2xl border px-3.5 py-2.5', isDark ? 'border-[#232838] bg-[#111622]' : 'border-[#E8ECF1] bg-white')}>
    <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', tone === 'warning' ? 'bg-[#F59E0B]/12 text-[#D97706]' : 'bg-[#2563EB]/10 text-[#2563EB]')}>
      <Icon className="h-4 w-4" strokeWidth={2} />
    </span>
    <div className="min-w-0">
      <div className={cn('text-[10px] font-semibold uppercase tracking-[0.08em]', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>{label}</div>
      <div className={cn('truncate text-[13.5px] font-semibold leading-tight', isDark ? 'text-white' : 'text-[#0F172A]')}>{value}</div>
    </div>
  </div>
);

const CountdownUnit: React.FC<{ value: string; label: string; isDark: boolean }> = ({ value, label, isDark }) => (
  <div className="flex flex-col items-center">
    <div className={cn('flex h-[52px] w-[52px] items-center justify-center rounded-2xl font-mono text-[24px] font-bold tabular-nums sm:h-[58px] sm:w-[58px] sm:text-[27px]', isDark ? 'bg-[#111622] text-white' : 'bg-white text-[#0F172A] shadow-[0_2px_10px_-4px_rgba(15,23,42,0.12)]')}>
      {value}
    </div>
    <div className={cn('mt-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>{label}</div>
  </div>
);

export const FanHero: React.FC<{ isDark: boolean; onViewTicket: () => void }> = ({ isDark, onViewTicket }) => {
  const reduce = useReducedMotion();
  const { h, m, s } = useCountdown(MATCH.kickoffOffsetMs);
  const fadeUp = (d = 0) => ({ initial: reduce ? false : { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay: d, ease: EASE } });

  return (
    <section className="relative overflow-hidden">
      {/* ambient glow — subtle */}
      <div aria-hidden className={cn('pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[820px] rounded-full blur-3xl', isDark ? 'bg-[#2563EB]/[0.14]' : 'bg-[#2563EB]/[0.07]')} />
      <div aria-hidden className={cn('pointer-events-none absolute -top-24 left-[-10%] h-[420px] w-[620px] rounded-full blur-3xl', isDark ? 'bg-[#6B4EFF]/[0.1]' : 'bg-[#6B4EFF]/[0.05]')} />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-8 px-4 pt-8 pb-4 sm:px-6 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:px-8 lg:pt-16">
        {/* ── Left: content ─────────────────────────────── */}
        <div>
          <motion.div {...fadeUp()} className="flex items-center gap-2">
            <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] font-semibold', isDark ? 'border-[#232838] bg-[#141822] text-[#7CA6FF]' : 'border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#2563EB]')}>
              {MATCH.competition}
            </span>
            <span className={cn('text-[12.5px] font-medium', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{MATCH.stage} · {MATCH.venue}</span>
          </motion.div>

          <motion.h1 {...fadeUp(0.06)} className={cn('mt-5 font-display text-[clamp(30px,5vw,46px)] font-semibold leading-[1.05] tracking-[-0.02em]', isDark ? 'text-white' : 'text-[#0B0F19]')}>
            Welcome back, Alex.
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className={cn('mt-3 text-[17px] leading-[1.6]', isDark ? 'text-[#9AA3B2]' : 'text-[#5B6472]')}>
            <span className="font-semibold" style={{ color: isDark ? '#fff' : '#0F172A' }}>{MATCH.home.name} vs {MATCH.away.name}</span> kicks off soon. Your ticket and step-free route are ready.
          </motion.p>

          {/* Countdown */}
          <motion.div {...fadeUp(0.16)} className="mt-7 flex items-end gap-3">
            <CountdownUnit value={h} label="Hours" isDark={isDark} />
            <span className="pb-6 font-mono text-[22px] font-bold" style={{ color: isDark ? '#2A3346' : '#CBD5E1' }}>:</span>
            <CountdownUnit value={m} label="Minutes" isDark={isDark} />
            <span className="pb-6 font-mono text-[22px] font-bold" style={{ color: isDark ? '#2A3346' : '#CBD5E1' }}>:</span>
            <CountdownUnit value={s} label="Seconds" isDark={isDark} />
            <span className={cn('pb-6 pl-1 text-[13px] font-medium', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>to kickoff</span>
          </motion.div>

          {/* Status pills */}
          <motion.div {...fadeUp(0.22)} className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <StatPill icon={TicketIcon} label="Gate" value={TICKET.gate} isDark={isDark} />
            <StatPill icon={MapPin} label="Seat" value={TICKET.section} isDark={isDark} />
            <StatPill icon={CloudSun} label="Weather" value={`${CONDITIONS.weather.tempF}°F ${CONDITIONS.weather.condition}`} isDark={isDark} />
            <StatPill icon={Users} label="Crowd" value={CONDITIONS.crowd.label} isDark={isDark} tone="warning" />
            <StatPill icon={Car} label="Parking" value={CONDITIONS.parking.label} isDark={isDark} tone="warning" />
            <StatPill icon={MapPin} label="Your seat" value={TICKET.seat} isDark={isDark} />
          </motion.div>

          <motion.button
            {...fadeUp(0.3)}
            onClick={onViewTicket}
            whileHover={reduce ? undefined : { y: -2, scale: 1.015 }}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="group mt-7 flex h-[54px] w-full items-center justify-center gap-2.5 rounded-2xl bg-[#2563EB] px-7 text-[15.5px] font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.32)] transition-shadow duration-200 hover:shadow-[0_16px_40px_rgba(37,99,235,0.42)] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 sm:w-auto"
          >
            <QrCode className="h-5 w-5" strokeWidth={2} />
            View Digital Ticket
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* ── Right: illustration + floating match card ──── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
          className="relative mx-auto aspect-[16/12] w-full max-w-[560px] lg:max-w-none"
        >
          <img src={isDark ? stadiumDark : stadiumLight} alt="PERIMO smart stadium" width={1024} height={768} loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-contain drop-shadow-2xl" draggable={false} />

          {/* Floating match score card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
            className={cn('absolute left-1/2 bottom-[2%] w-[min(340px,88%)] -translate-x-1/2 rounded-2xl border p-4 shadow-[0_20px_50px_-16px_rgba(15,23,42,0.28)] backdrop-blur-md', isDark ? 'border-[#232838] bg-[#141822]/92' : 'border-[#E8ECF1] bg-white/92')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-[22px]">{MATCH.home.flag}</span>
                <span className={cn('text-[15px] font-bold', isDark ? 'text-white' : 'text-[#0F172A]')}>{MATCH.home.short}</span>
              </div>
              <div className="text-center">
                <div className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide', isDark ? 'bg-[#16A34A]/15 text-[#4ADE80]' : 'bg-[#16A34A]/10 text-[#15803D]')}>Starts {MATCH.kickoffLabel.split('·')[1]?.trim()}</div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={cn('text-[15px] font-bold', isDark ? 'text-white' : 'text-[#0F172A]')}>{MATCH.away.short}</span>
                <span className="text-[22px]">{MATCH.away.flag}</span>
              </div>
            </div>
            <div className={cn('mt-3 flex items-center justify-center gap-1.5 border-t pt-3 text-[12px] font-medium', isDark ? 'border-[#232838] text-[#8A93A3]' : 'border-[#F1F5F9] text-[#64748B]')}>
              <MapPin className="h-3.5 w-3.5" /> {TICKET.gate} · {TICKET.section} · {TICKET.seat}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
