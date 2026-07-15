import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { OPERATIONS_ROLES } from '../data';
import { OperationsCard } from './OperationsCard';

interface OperationsSectionProps {
  isDark: boolean;
  onSelect: (path: string) => void;
}

export const OperationsSection = forwardRef<HTMLElement, OperationsSectionProps>(({ isDark, onSelect }, ref) => {
  const reduceMotion = useReducedMotion();

  return (
    <section ref={ref} className={cn('scroll-mt-8 py-16 sm:py-20', isDark ? 'bg-[#0A0E14]' : 'bg-white')}>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-[560px]"
        >
          <span className={cn('text-[11px] font-semibold tracking-[0.1em]', isDark ? 'text-[#5B6472]' : 'text-[#94A3B8]')}>
            INTERNAL OPERATIONS
          </span>
          <h2 className={cn('mt-3 font-display text-[26px] font-semibold tracking-[-0.01em] sm:text-[30px]', isDark ? 'text-white' : 'text-[#0F172A]')}>
            Operations Management Portal
          </h2>
          <p className={cn('mt-2 text-[14.5px] leading-relaxed', isDark ? 'text-[#9AA3B2]' : 'text-[#64748B]')}>
            Secure, role-based access for stadium operations and management teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {OPERATIONS_ROLES.map((role, i) => (
            <OperationsCard key={role.id} role={role} isDark={isDark} onSelect={onSelect} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

OperationsSection.displayName = 'OperationsSection';
