import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { OperationsRole } from '../data';

const ACCENT_STYLES = {
  green: { icon: 'bg-[#1FAA6D]/10 text-[#1FAA6D]', badge: 'bg-[#1FAA6D]/10 text-[#166534]', ring: 'hover:border-[#1FAA6D]/30', dot: 'bg-[#1FAA6D]' },
  orange: { icon: 'bg-[#EA580C]/10 text-[#EA580C]', badge: 'bg-[#EA580C]/10 text-[#9A3412]', ring: 'hover:border-[#EA580C]/30', dot: 'bg-[#EA580C]' },
  blue: { icon: 'bg-[#2563EB]/10 text-[#2563EB]', badge: 'bg-[#2563EB]/10 text-[#1E40AF]', ring: 'hover:border-[#2563EB]/40', dot: 'bg-[#2563EB]' },
  red: { icon: 'bg-[#C4291C]/10 text-[#C4291C]', badge: 'bg-[#C4291C]/10 text-[#991B1B]', ring: '', dot: 'bg-[#C4291C]' },
} as const;

const ACCENT_STYLES_DARK = {
  green: { icon: 'bg-[#1FAA6D]/15 text-[#3ED996]', badge: 'bg-[#1FAA6D]/15 text-[#6EE7B7]', ring: 'hover:border-[#1FAA6D]/30', dot: 'bg-[#3ED996]' },
  orange: { icon: 'bg-[#EA580C]/15 text-[#FB923C]', badge: 'bg-[#EA580C]/15 text-[#FDBA74]', ring: 'hover:border-[#EA580C]/30', dot: 'bg-[#FB923C]' },
  blue: { icon: 'bg-[#2563EB]/15 text-[#7CA6FF]', badge: 'bg-[#2563EB]/15 text-[#9DB8FF]', ring: 'hover:border-[#2563EB]/40', dot: 'bg-[#7CA6FF]' },
  red: { icon: 'bg-[#C4291C]/15 text-[#F87171]', badge: 'bg-[#C4291C]/15 text-[#FCA5A5]', ring: '', dot: 'bg-[#F87171]' },
} as const;

interface OperationsCardProps {
  role: OperationsRole;
  isDark: boolean;
  onSelect: (path: string) => void;
  index: number;
}

export const OperationsCard: React.FC<OperationsCardProps> = ({ role, isDark, onSelect, index }) => {
  const reduceMotion = useReducedMotion();
  const accent = (isDark ? ACCENT_STYLES_DARK : ACCENT_STYLES)[role.accent];
  const Icon = role.icon;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion || role.comingSoon ? undefined : { y: -4 }}
      className={cn(
        'group relative flex flex-col rounded-2xl border p-6 transition-all duration-200',
        role.comingSoon && 'opacity-70',
        isDark
          ? cn('border-[#232838] bg-[#141822]/60', !role.comingSoon && accent.ring)
          : cn('border-black/[0.06] bg-white', !role.comingSoon && accent.ring, !role.comingSoon && 'hover:shadow-[0_12px_32px_rgba(15,23,42,0.06)]')
      )}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', accent.icon)}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-[10.5px] font-bold tracking-wide', accent.badge)}>{role.badgeText}</span>
      </div>

      <h3 className={cn('font-display text-[17px] font-semibold', isDark ? 'text-white' : 'text-[#0F172A]')}>{role.title}</h3>
      <p className={cn('mt-1.5 text-[13.5px] leading-relaxed', isDark ? 'text-[#9AA3B2]' : 'text-[#64748B]')}>{role.description}</p>

      <ul className="mt-4 flex flex-col gap-1.5">
        {role.bullets.map((bullet) => (
          <li key={bullet} className={cn('flex items-center gap-2 text-[12.5px]', isDark ? 'text-[#C7CDD6]' : 'text-[#475569]')}>
            <Check className={cn('h-3.5 w-3.5 shrink-0', isDark ? 'text-[#9AA3B2]' : 'text-[#94A3B8]')} strokeWidth={2.5} />
            {bullet}
          </li>
        ))}
      </ul>

      <motion.button
        onClick={() => !role.comingSoon && onSelect(role.path)}
        disabled={role.comingSoon}
        whileHover={reduceMotion || role.comingSoon ? undefined : { scale: 1.02 }}
        whileTap={reduceMotion || role.comingSoon ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'group/btn mt-6 flex h-11 items-center justify-center gap-1.5 rounded-xl text-[13.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          role.comingSoon
            ? cn('cursor-not-allowed', isDark ? 'bg-[#1a1f2c] text-[#5B6472]' : 'bg-[#F1F5F9] text-[#94A3B8]')
            : role.isPrimary
            ? 'bg-[#2563EB] text-white shadow-[0_4px_14px_rgba(37,99,235,0.24)] hover:bg-[#1D4ED8] hover:shadow-[0_8px_22px_rgba(37,99,235,0.34)] focus-visible:ring-[#2563EB]'
            : isDark
            ? 'border border-[#232838] text-[#E5E9F0] hover:bg-[#1a1f2c] focus-visible:ring-[#2563EB]'
            : 'border border-black/[0.08] text-[#0F172A] hover:bg-[#F8FAFC] hover:shadow-sm focus-visible:ring-[#2563EB]'
        )}
      >
        {role.comingSoon && <Lock className="h-3.5 w-3.5" strokeWidth={2} />}
        {role.buttonText}
        {!role.comingSoon && <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" strokeWidth={2.5} />}
      </motion.button>
    </motion.div>
  );
};
