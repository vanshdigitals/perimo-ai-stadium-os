import React from 'react'
import { Heart, ShoppingBag } from 'lucide-react'

interface MerchCardProps {
  name: string
  image: string
  price: string
  tag?: string
}

export const MerchCard: React.FC<MerchCardProps> = ({
  name,
  image,
  price,
  tag
}) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full min-w-[220px]">
      <div className="relative h-48 overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-4">
        <img src={image} alt={name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
        {tag && (
          <div className="absolute top-3 left-3 bg-[#0F172A] text-white text-[10px] font-bold px-2 py-1 rounded text-center tracking-wider uppercase">
            {tag}
          </div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#64748B] hover:text-[#EF4444] transition-colors shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-1 border-t border-[#F1F5F9]">
        <h4 className="font-bold text-[#0F172A] text-[14px] leading-snug mb-1 line-clamp-2">{name}</h4>
        <div className="font-semibold text-[#2563EB] text-[15px] mb-4">
          {price}
        </div>
        
        <div className="mt-auto">
          <button className="w-full h-9 bg-white border-2 border-[#0F172A] hover:bg-[#0F172A] hover:text-white text-[#0F172A] rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
