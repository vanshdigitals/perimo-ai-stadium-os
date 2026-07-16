import React from 'react'
import { Heart, MapPin, Clock, Star } from 'lucide-react'

interface FoodCardProps {
  name: string
  image: string
  rating: number
  distance: string
  queueTime: string
  price: string
  recommendation: string
}

export const FoodCard: React.FC<FoodCardProps> = ({
  name,
  image,
  rating,
  distance,
  queueTime,
  price,
  recommendation
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full min-w-[280px]">
      <div className="relative h-40 overflow-hidden bg-[#F1F5F9]">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[11px] font-bold px-2 py-1 rounded-md text-[#2563EB] tracking-wide uppercase shadow-sm">
          {recommendation}
        </div>
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-[#0F172A] text-[15px] leading-tight">{name}</h4>
          <div className="flex items-center gap-1 bg-[#FEF3C7] text-[#B45309] px-1.5 py-0.5 rounded text-xs font-semibold">
            <Star className="w-3 h-3 fill-current" />
            {rating}
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-xs text-[#64748B] mb-4 mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {distance}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {queueTime}
          </div>
          <div className="font-medium text-[#0F172A] ml-auto">
            {price}
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[#F1F5F9]">
          <button className="w-full h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-semibold transition-colors">
            Order Pickup
          </button>
        </div>
      </div>
    </div>
  )
}
