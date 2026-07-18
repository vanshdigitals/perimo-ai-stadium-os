import React, { useEffect, useState } from 'react';
import type { HomeOverview } from '../api';
import { motion } from 'framer-motion';
import { Users, Train, ShieldCheck, CloudSun, CloudRain } from 'lucide-react';

const HighlightStat: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => {
  const [highlight, setHighlight] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    if (value !== prevValue) {
      setHighlight(true);
      setPrevValue(value);
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className="flex items-center gap-3 py-3 px-1">
      <div className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E4E9] flex items-center justify-center text-[#5B6472] shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-[#5B6472] uppercase tracking-wider">{label}</span>
        <motion.div 
          animate={highlight ? { backgroundColor: ['#FEF08A', 'transparent'] } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="rounded px-0.5 -mx-0.5"
        >
          <span className="text-sm font-semibold text-[#0F172A] capitalize tracking-tight">{value}</span>
        </motion.div>
      </div>
    </div>
  );
};

export const MatchDayStatusStrip: React.FC<{ home: HomeOverview }> = ({ home }) => {
  return (
    <div className="bg-white border border-[#E2E4E9] rounded-2xl shadow-sm px-4 lg:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-[#E2E4E9] md:divide-y-0 md:divide-x">
        <HighlightStat 
          icon={home.weather.icon === 'sun' ? <CloudSun className="w-4 h-4" /> : <CloudRain className="w-4 h-4" />}
          label="Weather" 
          value={`${home.weather.tempF}°F`} 
        />
        <HighlightStat 
          icon={<Users className="w-4 h-4" />} 
          label="Crowd" 
          value={home.status.crowd} 
        />
        <HighlightStat 
          icon={<Train className="w-4 h-4" />} 
          label="Transport" 
          value={home.status.transport} 
        />
        <HighlightStat 
          icon={<ShieldCheck className="w-4 h-4" />} 
          label="Security" 
          value="Normal" 
        />
      </div>
    </div>
  );
};
