import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, ChevronRight } from 'lucide-react';

export const MatchPreviewCard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white border border-slate-200/60 rounded-[24px] shadow-sm overflow-hidden flex flex-col md:flex-row"
    >
      <div className="flex-1 p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Live Pre-Match</span>
        </div>
        
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-2">
              🇦🇷
            </div>
            <p className="font-bold text-slate-800">Argentina</p>
          </div>
          
          <div className="flex-1 text-center">
            <p className="text-3xl font-display font-black text-slate-800">0 - 0</p>
            <p className="text-xs text-slate-400 font-bold mt-1">00:00</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-2">
              🇫🇷
            </div>
            <p className="font-bold text-slate-800">France</p>
          </div>
        </div>

        <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          View Lineups <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Video Preview */}
      <div className="md:w-64 lg:w-80 h-48 md:h-auto bg-slate-900 relative group cursor-pointer overflow-hidden">
        <img src="/assets/ai-gen/hero_stadium_night.png" alt="Match Preview" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <p className="text-white font-bold text-sm">Official Stream</p>
          <p className="text-white/60 text-xs">Coverage starts soon</p>
        </div>
      </div>
    </motion.div>
  );
};
