import React from 'react';
import type { Recommendation } from '../api';
import { Sparkles, ArrowRight } from 'lucide-react';

export const RecommendationCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-[#111118] border border-purple-500/20 rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-16 h-16" />
      </div>
      
      <div className="flex items-start gap-3 relative z-10">
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-1">{recommendation.title}</h4>
          <p className="text-xs text-white/60 mb-3">{recommendation.reason}</p>
          <button className="text-xs font-bold text-purple-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            {recommendation.action} <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
