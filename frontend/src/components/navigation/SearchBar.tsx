import React from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SearchBarProps {
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  return (
    <>
      {/* Desktop Search Bar */}
      <div className={cn("flex-1 max-w-[640px] mx-auto hidden md:block", className)}>
        <div className="flex items-center gap-2.5 h-[40px] px-3 rounded-[8px] bg-[#F1F5F9] border border-transparent hover:bg-[#E2E8F0]/60 focus-within:bg-white focus-within:border-[#2563EB] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] transition-all duration-200">
          <Search className="w-[16px] h-[16px] text-[#64748B] shrink-0" strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search stadiums, incidents, users, AI, assets..."
            className="flex-1 bg-transparent border-none text-[13px] text-[#0F172A] h-full focus:outline-none focus:ring-0 placeholder:text-[#94A3B8]"
          />
          <kbd className="font-sans text-[10px] font-semibold text-[#64748B] bg-white border border-[#E2E8F0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] rounded-[4px] px-1.5 py-0.5 shrink-0 whitespace-nowrap">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Mobile Search Icon */}
      <div className="flex-1 md:hidden"></div>
      <button className="md:hidden w-10 h-10 rounded-[10px] border border-[#E2E8F0] bg-white flex items-center justify-center text-[#334155] hover:bg-[#F1F5F9] transition-colors shrink-0">
        <Search className="w-[17px] h-[17px]" strokeWidth={2} />
      </button>
    </>
  )
}
