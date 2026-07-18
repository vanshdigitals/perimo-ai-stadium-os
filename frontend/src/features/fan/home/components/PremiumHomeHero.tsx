import React from 'react';
import type { HomeOverview } from '../api';
import { motion } from 'framer-motion';
import { LiveMatchCountdown } from './LiveMatchCountdown';
import { HeroTicketCard } from './HeroTicketCard';

export const PremiumHomeHero: React.FC<{ home: HomeOverview }> = ({ home }) => {
  // Mock kickoff time for demo (1h 15m from now)
  const kickoffTime = new Date(Date.now() + 75 * 60000);

  return (
    <div className="w-full mb-6 lg:mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white border border-[#E2E4E9] rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-sm relative">
        
        {/* Left Side (Content) */}
        <div className="flex-1 p-6 lg:p-12 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-widest px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
              Match Day
            </span>
            <span className="text-[#5B6472] text-sm font-semibold">ARG vs FRA</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-display font-semibold text-[#0F172A] leading-[1.1] tracking-tight mb-4"
          >
            {home.greeting.name.split(' ')[0]},<br />
            You're all set.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-[#5B6472] font-medium mb-2">Kickoff is in</p>
            <LiveMatchCountdown targetDate={kickoffTime} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {home.ticketPreview && <HeroTicketCard ticket={home.ticketPreview} />}
          </motion.div>
        </div>

        {/* Right Side (Illustration - Desktop Only) */}
        <div className="hidden lg:block w-5/12 h-[480px] bg-[#F8FAFC] relative overflow-hidden border-l border-[#E2E4E9]">
          <img 
            src="/assets/ai-gen/stadium-light.png" 
            alt="Stadium" 
            className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-multiply" 
            onError={(e) => {
              // Fallback if image doesn't exist yet
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>

      </div>
    </div>
  );
};
