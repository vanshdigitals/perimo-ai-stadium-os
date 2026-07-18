import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

const RECOMMENDATIONS = [
  {
    name: 'Smash Burger',
    subtitle: 'Double patty · Special sauce',
    image: '/assets/ai-gen/food_burger_isolated.png',
    rating: 4.9,
    wait: '5 min',
    price: '$14',
    tag: 'AI Pick',
    bg: 'bg-[#F8FAFC]',
    tagColor: 'bg-[#6B4EFF] text-white' // AI Accent
  },
  {
    name: 'Home Jersey 2026',
    subtitle: 'Official Merchandise',
    image: '/assets/ai-gen/merch_jersey_isolated.png',
    rating: 4.8,
    wait: 'Click & Collect',
    price: '$89',
    tag: 'Popular',
    bg: 'bg-[#F8FAFC]',
    tagColor: 'bg-[#0F172A] text-white'
  },
  {
    name: 'Gourmet Hotdog',
    subtitle: 'Brioche bun · Caramelised onion',
    image: '/assets/ai-gen/food_hotdog_isolated.png',
    rating: 4.5,
    wait: '2 min',
    price: '$9',
    tag: 'Near Gate',
    bg: 'bg-[#F8FAFC]',
    tagColor: 'bg-[#2563EB] text-white' // Brand
  },
];

export const ForYouDiscovery: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">For You</h3>
        <button className="text-sm font-semibold text-[#2563EB] hover:text-[#1D4ED8]">View All</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
        {RECOMMENDATIONS.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`shrink-0 w-64 ${item.bg} border border-[#E2E4E9] rounded-[24px] overflow-hidden snap-center cursor-pointer hover:shadow-md transition-shadow relative`}
          >
            <div className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full z-10 ${item.tagColor}`}>
              {item.tag}
            </div>
            
            <div className="h-40 p-6 flex items-end justify-center relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="bg-white p-4 border-t border-[#E2E4E9]">
              <h4 className="font-semibold text-[#0F172A]">{item.name}</h4>
              <p className="text-xs text-[#5B6472] mb-3">{item.subtitle}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.rating && <span className="flex items-center gap-1 text-xs font-semibold text-[#0F172A]"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.rating}</span>}
                  <span className="flex items-center gap-1 text-xs text-[#5B6472]"><Clock className="w-3.5 h-3.5" /> {item.wait}</span>
                </div>
                <span className="font-bold text-[#0F172A]">{item.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
