import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowRight, Sparkles, Navigation, Ticket, Flame, Play, WifiOff, Zap, MapPin, ShieldCheck, Globe, Signal, Battery, Wifi, Home, Search, Compass, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface FanHeroSectionProps {
  isDark: boolean;
  onClick: () => void;
}

export const FanHeroSection: React.FC<FanHeroSectionProps> = ({ isDark, onClick }) => {
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number): Variants => ({
    hidden: { opacity: 0, y: reduceMotion ? 0 : 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const } }
  });

  return (
    <section id="fan" className="relative overflow-hidden w-full min-h-[70vh] flex items-center -mt-[72px] pt-[88px] sm:pt-24 lg:pt-[104px] pb-12 sm:pb-20 lg:pb-24">
      {/* Background Asset matching the Landing Page Hero */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 0.95, opacity: isDark ? 0.2 : 0.25 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("absolute inset-0 bg-cover bg-center", isDark ? "bg-[url('@/assets/stadium-dark.png')]" : "bg-[url('@/assets/stadium-light.png')]")}
        />
        {/* Subtle grid pattern for "Digital Twin" feel */}
        <div className={cn("absolute inset-0", isDark ? "opacity-[0.05]" : "opacity-[0.03]")} style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px', color: isDark ? '#7CA6FF' : '#2563EB' }} />
        {/* Gradient Mask to fade smoothly into the next section */}
        <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-[#0A0E14]/80 via-[#0A0E14]/60 to-[#0A0E14]" : "bg-gradient-to-b from-white/80 via-white/60 to-[#FAFAFA]")} />
      </div>

      <div className="relative z-10 max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center mt-8 sm:mt-0">
          
          {/* Left Column: Copy & CTA */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <motion.div variants={fadeUp(0.1)} initial="hidden" animate="show">
              <Badge variant="success" icon={Flame} label="Hero Product" isDark={isDark} className="w-fit mb-3 sm:mb-4" />
            </motion.div>

            <motion.h1 
              variants={fadeUp(0.2)} 
              initial="hidden" 
              animate="show"
              className={cn("font-display text-[clamp(40px,6vw,64px)] font-bold leading-[1.1] tracking-tight", isDark ? "text-white" : "text-[#0F172A]")}
            >
              Choose Your <br className="hidden sm:block" /> Experience
            </motion.h1>

            <motion.p 
              variants={fadeUp(0.3)} 
              initial="hidden" 
              animate="show"
              className={cn("mt-6 sm:mt-8 max-w-[480px] text-[18px] sm:text-[20px] leading-[1.6]", isDark ? "text-[#94A3B8]" : "text-[#475569]")}
            >
              The Fan Experience is your AI companion for every moment. Navigate, explore, and enjoy a smarter, safer stadium experience.
            </motion.p>

            <motion.div variants={fadeUp(0.4)} initial="hidden" animate="show" className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onClick}
                className="group relative h-14 rounded-full bg-[#2563EB] text-white px-8 flex items-center justify-center gap-3 font-semibold text-[15px] overflow-hidden shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/40 transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                <span className="relative z-10">Launch Fan Experience</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('platform');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 96;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className={cn("group h-14 rounded-full px-8 flex items-center justify-center gap-2 font-semibold text-[15px] transition-all active:scale-[0.98] w-full sm:w-auto border", isDark ? "border-[#1E293B] bg-[#111622] hover:bg-[#1C2230] text-white" : "border-[#E2E8F0] bg-white hover:bg-gray-50 text-[#0F172A]")}
              >
                <Play className="w-4 h-4" fill="currentColor" />
                View Features
              </button>
            </motion.div>

            <motion.div variants={fadeUp(0.5)} initial="hidden" animate="show" className="mt-10 flex flex-wrap gap-3">
              <Badge variant="outline" icon={Navigation} label="AI Navigation" isDark={isDark} />
              <Badge variant="outline" icon={Ticket} label="Digital Ticket" isDark={isDark} />
              <Badge variant="outline" icon={Flame} label="Live Match" isDark={isDark} />
              <Badge variant="outline" icon={WifiOff} label="Offline Ready" isDark={isDark} />
            </motion.div>

            <motion.div variants={fadeUp(0.6)} initial="hidden" animate="show" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-[#F59E0B]" /><span className={cn("text-[12.5px] font-medium", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>AI Powered</span></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#2563EB]" /><span className={cn("text-[12.5px] font-medium", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>Indoor Navigation</span></div>
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /><span className={cn("text-[12.5px] font-medium", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>Safety First</span></div>
              <div className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[#8B5CF6]" /><span className={cn("text-[12.5px] font-medium", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>Offline Ready</span></div>
            </motion.div>
          </div>

          {/* Right Column: Phone Mockup & UI Elements */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end mt-12 lg:mt-[20px]">
            <div className="relative w-full max-w-[340px] aspect-[9/19.5]">
              {/* Phone Frame */}
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className={cn("absolute inset-0 rounded-[48px] border-[8px] shadow-2xl overflow-hidden flex flex-col", isDark ? "border-[#2A3143] bg-[#0A0E14] shadow-black/50" : "border-[#E2E8F0] bg-[#F8FAFC] shadow-[#2563EB]/10")}
              >
                {/* Status Bar */}
                <div className={cn("h-7 px-6 flex justify-between items-center text-[11px] font-medium pt-1", isDark ? "text-white" : "text-black")}>
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <Signal className="w-3.5 h-3.5" />
                    <Wifi className="w-3 h-3" />
                    <Battery className="w-4 h-4" />
                  </div>
                </div>

                {/* Header inside phone */}
                <div className={cn("h-12 flex items-center justify-between px-5 border-b", isDark ? "border-[#1E293B]" : "border-[#E2E8F0]")}>
                   <div className="w-24 h-4 rounded-full bg-[#2563EB]/20" />
                   <div className="w-8 h-8 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                     <User className="w-4 h-4 text-[#2563EB]" />
                   </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col gap-4 overflow-hidden relative">
                  {/* Digital Ticket */}
                  <div className="w-full aspect-[2/1] rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#6B4EFF] p-4 flex flex-col justify-between text-white shadow-lg relative overflow-hidden">
                     <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNGRkYiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')] bg-repeat" />
                     <div className="flex justify-between items-start relative z-10">
                       <Ticket className="w-6 h-6 opacity-90" />
                       <div className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-md">GATE 7</div>
                     </div>
                     <div className="relative z-10">
                       <div className="text-[10px] opacity-80 uppercase tracking-widest mb-0.5">Row 12 • Seat 8</div>
                       <div className="text-lg font-bold">Match Ticket</div>
                     </div>
                  </div>
                  
                  {/* AI Suggestion Mock */}
                  <div className={cn("p-4 rounded-xl flex gap-3 items-start", isDark ? "bg-[#1E293B]" : "bg-white shadow-sm border border-[#E2E8F0]")}>
                    <Sparkles className="w-5 h-5 text-[#6B4EFF] shrink-0 mt-0.5" />
                    <div>
                      <div className={cn("text-[12px] font-bold mb-1", isDark ? "text-white" : "text-[#0F172A]")}>AI Suggestion</div>
                      <div className={cn("text-[11px] leading-relaxed", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>Queue at Gate 7 is currently 4 mins. Optimal time to enter.</div>
                    </div>
                  </div>

                  {/* Navigation Action Mock */}
                  <div className={cn("p-4 rounded-xl flex items-center justify-between", isDark ? "bg-[#1E293B]" : "bg-white shadow-sm border border-[#E2E8F0]")}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className={cn("text-[12px] font-bold", isDark ? "text-white" : "text-[#0F172A]")}>Find my seat</div>
                        <div className={cn("text-[10px]", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>Step-free route available</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className={cn("h-[76px] mt-auto border-t flex flex-col justify-between pt-3 pb-1.5 relative", isDark ? "border-[#1E293B] bg-[#0A0E14]" : "border-[#E2E8F0] bg-[#F8FAFC]")}>
                  <div className="flex justify-between px-6">
                    <div className="flex flex-col items-center gap-1 text-[#2563EB]"><Home className="w-5 h-5" /><span className="text-[9px] font-semibold">Home</span></div>
                    <div className={cn("flex flex-col items-center gap-1", isDark ? "text-[#64748B]" : "text-[#94A3B8]")}><Search className="w-5 h-5" /><span className="text-[9px]">Search</span></div>
                    <div className={cn("flex flex-col items-center gap-1", isDark ? "text-[#64748B]" : "text-[#94A3B8]")}><Compass className="w-5 h-5" /><span className="text-[9px]">Explore</span></div>
                    <div className={cn("flex flex-col items-center gap-1", isDark ? "text-[#64748B]" : "text-[#94A3B8]")}><User className="w-5 h-5" /><span className="text-[9px]">Profile</span></div>
                  </div>
                  {/* Home Indicator */}
                  <div className="w-[120px] h-1 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-2" />
                </div>
              </motion.div>

              {/* Floating Nav Element */}
              <motion.div 
                initial={{ y: 30, x: 20, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className={cn("absolute top-32 -left-12 lg:-left-24 p-4 rounded-2xl shadow-xl flex items-center gap-4 border backdrop-blur-md hidden xl:flex", isDark ? "bg-[#1E293B]/90 border-[#334155]" : "bg-white/90 border-white/50")}
              >
                <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <div className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-[#0F172A]")}>AI Route Updated</div>
                  <div className={cn("text-[12px]", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>3 mins to Section 124</div>
                </div>
              </motion.div>

              {/* Floating Status Element */}
              <motion.div 
                initial={{ y: 30, x: -20, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={cn("absolute bottom-32 -right-8 lg:-right-16 p-4 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md hidden xl:flex", isDark ? "bg-[#1E293B]/90 border-[#334155]" : "bg-white/90 border-white/50")}
              >
                <div className="w-3 h-3 rounded-full bg-[#10B981] animate-pulse" />
                <div className={cn("text-[14px] font-bold", isDark ? "text-white" : "text-[#0F172A]")}>Gate Open</div>
              </motion.div>

              {/* Floating Insight Element */}
              <motion.div 
                initial={{ y: 30, x: -20, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className={cn("absolute top-12 -right-4 lg:-right-12 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md hidden xl:flex", isDark ? "bg-[#1E293B]/90 border-[#334155]" : "bg-white/90 border-white/50")}
              >
                <span className="text-xl">🔥</span>
                <div className={cn("text-[13px] font-bold", isDark ? "text-white" : "text-[#0F172A]")}>Live Crowd: High</div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
