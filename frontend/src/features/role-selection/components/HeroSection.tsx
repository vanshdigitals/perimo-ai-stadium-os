import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Navigation, Activity, UtensilsCrossed, Bot } from 'lucide-react';
import { cn } from '@/utils/cn';
import stadiumLight from '@/assets/stadium-light.png';
import stadiumDark from '@/assets/stadium-dark.png';
import { FEATURE_CHIPS } from '../data';
import { FloatingCard } from './FloatingCard';

interface HeroSectionProps {
  isDark: boolean;
  onStart: () => void;
  onLearnMore: () => void;
}

// Every entrance transition lands within the 200–500ms window end-to-end
// (base duration + stagger delay), so the hero settles quickly instead of
// trickling in.
const fadeUp = (reduceMotion: boolean | null, delay = 0) => ({
  initial: reduceMotion ? false : { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export const HeroSection: React.FC<HeroSectionProps> = ({ isDark, onStart, onLearnMore }) => {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={cn(
        'relative overflow-hidden transition-colors duration-300',
        isDark ? 'bg-[#0A0E14]' : 'bg-gradient-to-b from-white to-[#F8FAFC]'
      )}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full blur-3xl',
          isDark ? 'bg-[#2563EB]/[0.12]' : 'bg-[#2563EB]/[0.07]'
        )}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-12 lg:px-16 lg:py-14 xl:px-20 xl:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8">
          {/* ── Text column ─────────────────────────────────────── */}
          <div className="relative z-10">
            <motion.span
              {...fadeUp(reduceMotion)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold tracking-[0.04em]',
                isDark ? 'bg-[#2563EB]/15 text-[#7CA6FF]' : 'bg-[#2563EB]/10 text-[#2563EB]'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              PUBLIC ACCESS
            </motion.span>

            <motion.h1
              {...fadeUp(reduceMotion, 0.06)}
              className={cn(
                'mt-5 font-display font-semibold leading-[1.02] tracking-[-0.03em]',
                'text-[clamp(44px,7vw,76px)]',
                isDark ? 'text-white' : 'text-[#0B0F19]'
              )}
            >
              Fan
              <br />
              <span className="bg-gradient-to-r from-[#2563EB] to-[#5B8DEF] bg-clip-text text-transparent">Experience</span>
            </motion.h1>

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={cn('mt-5 max-w-[460px] text-[17px] leading-[1.65]', isDark ? 'text-[#9AA3B2]' : 'text-[#5B6472]')}
            >
              Your AI companion for every moment. Navigate, explore, and enjoy a smarter, safer, more connected stadium
              experience.
            </motion.p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {FEATURE_CHIPS.map((chip, i) => (
                <motion.span
                  key={chip.label}
                  {...fadeUp(reduceMotion, 0.16 + i * 0.05)}
                  className={cn(
                    'group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-200',
                    isDark
                      ? 'border-[#232838] bg-[#141822] text-[#C7CDD6] hover:border-[#2563EB]/40 hover:bg-[#161c29]'
                      : 'border-black/[0.06] bg-white text-[#334155] hover:border-[#2563EB]/25 hover:bg-[#F5F8FF] hover:shadow-sm'
                  )}
                >
                  <chip.icon
                    className={cn(
                      'h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6',
                      isDark ? 'text-[#7CA6FF]' : 'text-[#2563EB]'
                    )}
                    strokeWidth={2}
                  />
                  {chip.label}
                </motion.span>
              ))}
            </div>

            <motion.div {...fadeUp(reduceMotion, 0.4)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                onClick={onStart}
                whileHover={reduceMotion ? undefined : { y: -2, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="group flex h-[52px] items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3.5 text-[15.5px] font-semibold text-white shadow-[0_8px_24px_rgba(37,99,235,0.28)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(37,99,235,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                Start Stadium Experience
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
              </motion.button>

              <motion.button
                onClick={onLearnMore}
                whileHover={reduceMotion ? undefined : { y: -1, scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  'flex h-[52px] items-center justify-center rounded-xl px-6 py-3.5 text-[15.5px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2',
                  isDark ? 'text-[#E5E9F0] hover:bg-[#141822]' : 'text-[#0F172A] hover:bg-black/[0.03]'
                )}
              >
                Learn More
              </motion.button>
            </motion.div>
          </div>

          {/* ── Hero art column ─────────────────────────────────── */}
          {/* Sized ~18% larger than the original 560px cap, and responsive:
              full-width on mobile, centered on tablet, progressively larger
              from laptop up to desktop. aspect-square + explicit intrinsic
              size on the <img> reserves the box up front so nothing shifts
              while the (large) PNG decodes. */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[460px] lg:max-w-[600px] xl:max-w-[660px]"
          >
            <img
              src={isDark ? stadiumDark : stadiumLight}
              alt="Isometric illustration of the PERIMO smart stadium"
              width={1024}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-contain drop-shadow-2xl"
              draggable={false}
            />

            <FloatingCard
              position="top-right"
              delay={0.2}
              icon={Activity}
              iconClassName="bg-[#F59E0B]/15 text-[#D97706]"
              title="Live Crowd"
              isDark={isDark}
              floatOffset={0}
            >
              Density · <span className="font-semibold text-[#D97706]">Medium</span>
            </FloatingCard>

            <FloatingCard
              position="top-left"
              delay={0.28}
              icon={Navigation}
              iconClassName="bg-[#2563EB]/15 text-[#2563EB]"
              title="AI Route"
              isDark={isDark}
              floatOffset={1}
            >
              Gate 8 → Seat 125 · 4 min
            </FloatingCard>

            <FloatingCard
              position="mid-left"
              delay={0.36}
              icon={UtensilsCrossed}
              iconClassName="bg-[#EA580C]/15 text-[#EA580C]"
              title="Food Match"
              isDark={isDark}
              floatOffset={2}
            >
              Best pick near Gate 12 · 2 min
            </FloatingCard>

            <FloatingCard
              position="bottom-right"
              delay={0.44}
              icon={Bot}
              iconClassName="bg-[#2563EB]/15 text-[#2563EB]"
              title="AI Assistant"
              isDark={isDark}
              floatOffset={3}
            >
              &ldquo;Hi! How can I help today?&rdquo;
            </FloatingCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
