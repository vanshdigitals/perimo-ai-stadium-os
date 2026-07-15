import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { FLOATING_CARD_POSITIONS, type FloatingCardPosition } from '../data';

interface FloatingCardProps {
  position: FloatingCardPosition;
  delay?: number;
  icon: LucideIcon;
  iconClassName?: string;
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  className?: string;
  /** 0–3ish — staggers the continuous idle float so cards never drift in sync. */
  floatOffset?: number;
}

/** A single floating context card around the hero stadium art. Desktop/tablet
 *  only — see HeroSection, which hides the whole cluster on mobile rather
 *  than cramming five overlapping cards onto a small screen.
 *
 *  Entrance (fade/scale in, once) and idle float (continuous, subtle) are two
 *  separate motion layers so the infinite loop never fights the one-off
 *  entrance transition. */
export const FloatingCard: React.FC<FloatingCardProps> = ({
  position,
  delay = 0,
  icon: Icon,
  iconClassName,
  title,
  children,
  isDark,
  className,
  floatOffset = 0,
}) => {
  const reduceMotion = useReducedMotion();
  const floatDuration = 7 + floatOffset * 1.1; // 7–10s, varied per card
  const floatDelay = 0.6 + floatOffset * 0.5;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('hidden lg:block absolute z-10', FLOATING_CARD_POSITIONS[position])}
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -6, 0], rotate: [0, 0.5, -0.3, 0] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: floatDuration, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }
        }
        whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.18 } }}
        className={cn(
          'flex flex-col gap-1 rounded-2xl border px-3.5 py-3 shadow-xl backdrop-blur-xl min-w-[168px]',
          isDark ? 'bg-[#141822]/90 border-[#232838] shadow-black/30' : 'bg-white/90 border-black/[0.06] shadow-slate-900/[0.08]',
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <span className={cn('flex h-5 w-5 items-center justify-center rounded-full shrink-0', iconClassName)}>
            <Icon className="h-3 w-3" strokeWidth={2.5} />
          </span>
          <span className={cn('text-[11.5px] font-semibold tracking-tight', isDark ? 'text-white' : 'text-[#0F172A]')}>{title}</span>
        </div>
        <div className={cn('text-[11px] leading-snug', isDark ? 'text-[#9AA3B2]' : 'text-[#64748B]')}>{children}</div>
      </motion.div>
    </motion.div>
  );
};
