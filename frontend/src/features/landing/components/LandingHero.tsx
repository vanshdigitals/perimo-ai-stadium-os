import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, type LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import stadiumLight from '@/assets/stadium-light.png';
import stadiumDark from '@/assets/stadium-dark.png';
import { HERO_CARDS } from '../data';

interface LandingHeroProps {
  isDark: boolean;
  onGetStarted: () => void;
  onExplore: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (reduce: boolean | null, delay = 0) => ({
  initial: reduce ? false : { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: EASE },
});

const FloatingInfoCard: React.FC<{
  icon: LucideIcon; title: string; detail: string; tint: string;
  position: string; tabletHidden?: boolean; scale?: number; delay: number; floatOffset: number; isDark: boolean; reduce: boolean | null;
}> = ({ icon: Icon, title, detail, tint, position, tabletHidden, scale = 1, delay, floatOffset, isDark, reduce }) => (
  <motion.div
    initial={reduce ? false : { opacity: 0, scale: 0.9 * scale, y: 12 }}
    animate={{ opacity: 1, scale: 1 * scale, y: 0 }}
    transition={{ duration: 0.6, delay, ease: EASE }}
    className={cn('absolute z-20', tabletHidden ? 'hidden lg:block' : 'hidden sm:block', position)}
  >
    <motion.div
      animate={reduce ? undefined : { y: [0, -6, 0] }}
      transition={{ duration: 6 + floatOffset * 1.2, delay: 0.5 + floatOffset * 0.3, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(
        'flex items-center gap-3.5 rounded-xl border px-4 py-3 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.15)] backdrop-blur-md',
        isDark ? 'border-[#232838] bg-[#141822]/90' : 'border-[#E2E4E9] bg-white/95',
      )}
    >
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', tint)}>
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 pr-1">
        <div className={cn('text-[14px] font-bold leading-tight tracking-tight', isDark ? 'text-white' : 'text-[#0F172A]')}>{title}</div>
        <div className={cn('mt-0.5 text-[12px] font-medium leading-tight', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{detail}</div>
      </div>
    </motion.div>
  </motion.div>
);

export const LandingHero: React.FC<LandingHeroProps> = ({ isDark, onGetStarted, onExplore }) => {
  const reduce = useReducedMotion();

  return (
    <section
      className={cn('relative overflow-hidden transition-colors duration-300', isDark ? 'bg-[#0A0E14]' : 'bg-gradient-to-b from-white to-[#F8FAFC]')}
    >
      {/* Ambient radial glow — subtle, no neon */}
      <div aria-hidden className={cn('pointer-events-none absolute -top-48 left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl', isDark ? 'bg-[#2563EB]/[0.13]' : 'bg-[#2563EB]/[0.06]')} />
      <div aria-hidden className={cn('pointer-events-none absolute left-1/2 top-[38%] h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-3xl', isDark ? 'bg-[#6B4EFF]/[0.08]' : 'bg-[#6B4EFF]/[0.04]')} />

      <div className="relative mx-auto max-w-[1280px] px-5 pt-16 pb-8 text-center sm:pt-20 lg:pt-24">
        {/* ── Centered copy (max 760px) ─────────────────────────── */}
        <div className="mx-auto max-w-[760px]">
          <motion.span
            {...fadeUp(reduce)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.02em]',
              isDark ? 'border-[#232838] bg-[#141822] text-[#7CA6FF]' : 'border-[#2563EB]/15 bg-[#2563EB]/[0.06] text-[#2563EB]',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            AI Stadium Operating System · FIFA World Cup 2026
          </motion.span>

          <motion.h1
            {...fadeUp(reduce, 0.06)}
            className={cn(
              'mx-auto mt-6 font-display font-semibold tracking-[-0.03em]',
              'text-[clamp(36px,6vw,64px)] leading-[1.04]',
              isDark ? 'text-white' : 'text-[#0B0F19]',
            )}
          >
            The AI Operating System for
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-[#2563EB] to-[#6B4EFF] bg-clip-text text-transparent">modern stadium experiences</span>
          </motion.h1>

          <motion.p
            {...fadeUp(reduce, 0.12)}
            className={cn('mx-auto mt-6 max-w-[620px] text-[17px] leading-[1.7] sm:text-[18px]', isDark ? 'text-[#9AA3B2]' : 'text-[#5B6472]')}
          >
            PERIMO unifies real-time crowd intelligence, AI navigation, incident response and accessible fan
            experiences into one operating picture — so every stadium runs safer, smarter and in perfect sync.
          </motion.p>

          <motion.div {...fadeUp(reduce, 0.2)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <motion.button
              onClick={onGetStarted}
              whileHover={reduce ? undefined : { y: -2, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-7 text-[15.5px] font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.30)] transition-shadow duration-200 hover:shadow-[0_14px_36px_rgba(37,99,235,0.42)] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
            </motion.button>
            <motion.button
              onClick={onExplore}
              whileHover={reduce ? undefined : { y: -1, scale: 1.02 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={cn(
                'flex h-[52px] w-full items-center justify-center rounded-xl border px-7 text-[15.5px] font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 sm:w-auto',
                isDark ? 'border-[#232838] text-[#E5E9F0] hover:bg-[#141822]' : 'border-[#E2E4E9] bg-white text-[#0F172A] hover:bg-[#F8FAFC]',
              )}
            >
              Explore Platform
            </motion.button>
          </motion.div>
        </div>

        {/* ── Illustration + floating cards ─────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: EASE }}
          className="relative mx-auto mt-8 aspect-[16/11] w-[115%] max-w-none -translate-x-[7.5%] sm:mt-12 sm:w-full sm:max-w-[840px] sm:translate-x-0"
        >
          <img
            src={isDark ? stadiumDark : stadiumLight}
            alt="Isometric illustration of the PERIMO smart stadium"
            width={1024}
            height={704}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-contain drop-shadow-2xl"
            draggable={false}
          />
          {HERO_CARDS.map((c) => (
            <FloatingInfoCard
              key={c.id}
              icon={c.icon}
              title={c.title}
              detail={c.detail}
              tint={c.tint}
              position={c.position}
              tabletHidden={c.tabletHidden}
              scale={c.scale}
              floatOffset={c.floatOffset}
              delay={c.delay}
              isDark={isDark}
              reduce={reduce}
            />
          ))}
        </motion.div>

        {/* ── Mobile Intelligence Row ───────────────────────────────── */}
        <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-2 sm:hidden sm:scrollbar-hide">
          {HERO_CARDS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={reduce ? false : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05, ease: EASE }}
              className={cn(
                'flex w-[200px] shrink-0 snap-center items-center gap-3.5 rounded-xl border px-4 py-3 shadow-md',
                isDark ? 'border-[#232838] bg-[#141822]' : 'border-[#E2E4E9] bg-white',
              )}
            >
              <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', c.tint)}>
                <c.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="min-w-0 text-left pr-1">
                <div className={cn('text-[14px] font-bold leading-tight tracking-tight truncate', isDark ? 'text-white' : 'text-[#0F172A]')}>{c.title}</div>
                <div className={cn('mt-0.5 text-[12px] font-medium leading-tight truncate', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>{c.detail}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
