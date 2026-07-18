import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ContinueJourneyProps {
  isDark: boolean;
  onExplore: () => void;
  onLearnMore: () => void;
}

export const ContinueJourney: React.FC<ContinueJourneyProps> = ({ isDark, onExplore, onLearnMore }) => {
  const reduceMotion = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } }
  };

  return (
    <section className={cn("py-16 sm:py-24 relative overflow-hidden", isDark ? "bg-[#0A0E14]" : "bg-white")}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[100px] rounded-full", isDark ? "bg-[#2563EB]/[0.08]" : "bg-[#2563EB]/[0.04]")} />
      </div>

      <div className="max-w-[800px] mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[13px] font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4" />
            <span>The Future is Here</span>
          </div>
          
          <h2 className={cn("text-4xl sm:text-5xl font-display font-bold tracking-tight mb-6 leading-tight", isDark ? "text-white" : "text-[#0F172A]")}>
            Ready to experience the future of stadium operations?
          </h2>
          
          <p className={cn("text-[17px] mb-10 leading-relaxed max-w-[600px] mx-auto", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>
            Whether you're attending a match, volunteering your time, or managing the entire facility—PERIMO adapts to your role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="flex items-center justify-center h-14 px-8 rounded-full bg-[#2563EB] text-white font-semibold text-[15px] hover:bg-[#1D4ED8] hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-[#2563EB]/25 w-full sm:w-auto"
            >
              Explore Fan Experience
            </button>
            
            <button
              onClick={onLearnMore}
              className={cn(
                "flex items-center justify-center gap-2 h-14 px-8 rounded-full font-semibold text-[15px] border hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto",
                isDark 
                  ? "bg-[#141822] border-[#232838] text-white hover:border-[#334155]" 
                  : "bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
              )}
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
