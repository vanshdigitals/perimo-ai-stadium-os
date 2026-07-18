import React from 'react';
import type { HomeOverview } from '../api';
import { motion } from 'framer-motion';
import { Users, Train, ShieldCheck, CloudSun, Sparkles } from 'lucide-react';

export const LiveInfoGrid: React.FC<{ home: HomeOverview }> = ({ home }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4"
    >
      <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
          <Users className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Crowd</p>
          <p className="text-lg font-bold text-slate-800 capitalize">{home.status.crowd}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
          <Train className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
            <Train className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Transit</p>
          <p className="text-lg font-bold text-slate-800 capitalize">{home.status.transport}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
          <ShieldCheck className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Security</p>
          <p className="text-lg font-bold text-slate-800 capitalize">Normal</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
          <CloudSun className="w-16 h-16" />
        </div>
        <div className="relative z-10">
          <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center mb-3">
            <CloudSun className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Weather</p>
          <p className="text-lg font-bold text-slate-800 capitalize">{home.weather.tempF}°F</p>
        </div>
      </motion.div>

      {/* AI Recommendation spans full width on mobile, half on desktop */}
      <motion.div variants={item} className="col-span-2 md:col-span-4 bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Avoid Gate {home.ticketPreview?.gate.name}</h4>
          <p className="text-xs text-slate-500">Crowd density is high. AI recommends entering through Gate C2 instead.</p>
        </div>
      </motion.div>

    </motion.div>
  );
};
