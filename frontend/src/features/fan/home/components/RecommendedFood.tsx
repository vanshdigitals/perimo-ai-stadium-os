import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';

const FOOD_ITEMS = [
  {
    name: 'Smash Burger',
    subtitle: 'Double patty · Special sauce',
    image: '/assets/ai-gen/food_burger_isolated.png',
    rating: 4.9,
    wait: '5 min',
    price: '$14',
    tag: 'AI Pick',
    bg: 'bg-amber-50',
    tagColor: 'bg-blue-600 text-white'
  },
  {
    name: 'Loaded Nachos',
    subtitle: 'Jalapeño · Cheese · Salsa',
    image: '/assets/ai-gen/food_nachos_isolated.png',
    rating: 4.7,
    wait: 'No wait',
    price: '$11',
    tag: 'Popular',
    bg: 'bg-red-50',
    tagColor: 'bg-red-500 text-white'
  },
  {
    name: 'Gourmet Hotdog',
    subtitle: 'Brioche bun · Caramelised onion',
    image: '/assets/ai-gen/food_hotdog_isolated.png',
    rating: 4.5,
    wait: '2 min',
    price: '$9',
    tag: 'Near Gate',
    bg: 'bg-emerald-50',
    tagColor: 'bg-emerald-500 text-white'
  },
];

export const RecommendedFood: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recommended Food</h3>
        <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 hide-scrollbar snap-x snap-mandatory">
        {FOOD_ITEMS.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (i * 0.1) }}
            className={`shrink-0 w-64 ${item.bg} rounded-[24px] overflow-hidden snap-center cursor-pointer hover:shadow-md transition-shadow relative`}
          >
            <div className={`absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full z-10 ${item.tagColor}`}>
              {item.tag}
            </div>
            
            <div className="h-40 p-6 flex items-end justify-center relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="bg-white p-4 border-t border-slate-100">
              <h4 className="font-bold text-slate-900">{item.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{item.subtitle}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-700"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.rating}</span>
                  <span className="flex items-center gap-1 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" /> {item.wait}</span>
                </div>
                <span className="font-bold text-slate-900">{item.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
