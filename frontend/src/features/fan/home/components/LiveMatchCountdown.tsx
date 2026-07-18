import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface LiveMatchCountdownProps {
  targetDate: Date;
}

export const LiveMatchCountdown: React.FC<LiveMatchCountdownProps> = ({ targetDate }) => {
  const reduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<{ h: number; m: number; s: number }>({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, targetDate.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1.5 font-display font-semibold text-[#0F172A]">
      <div className="flex items-baseline">
        <span className="text-xl leading-none tabular-nums tracking-tight">{String(timeLeft.h).padStart(2, '0')}</span>
        <span className="text-xs text-[#5B6472] ml-0.5">h</span>
      </div>
      <motion.span 
        animate={reduceMotion ? {} : { opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-[#5B6472] font-medium"
      >
        :
      </motion.span>
      <div className="flex items-baseline">
        <span className="text-xl leading-none tabular-nums tracking-tight">{String(timeLeft.m).padStart(2, '0')}</span>
        <span className="text-xs text-[#5B6472] ml-0.5">m</span>
      </div>
      <motion.span 
        animate={reduceMotion ? {} : { opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="text-[#5B6472] font-medium"
      >
        :
      </motion.span>
      <div className="flex items-baseline">
        <span className="text-xl leading-none tabular-nums tracking-tight">{String(timeLeft.s).padStart(2, '0')}</span>
        <span className="text-xs text-[#5B6472] ml-0.5">s</span>
      </div>
    </div>
  );
};
