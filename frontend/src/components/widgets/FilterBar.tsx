import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  tabs?: { label: string; value: string; count?: number }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  actions?: React.ReactNode;
}

/** Search + segmented tabs + trailing actions — the standard filter row used
 *  above tables/queues across every module. */
export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  tabs,
  activeTab,
  onTabChange,
  actions,
}) => (
  <div className="flex flex-wrap items-center gap-3 mb-4">
    {onSearchChange && (
      <div className="relative flex-1 min-w-[200px] max-w-[320px]">
        <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-[34px] pl-9 pr-3 rounded-[8px] border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] placeholder:text-[#94A3B8]"
        />
      </div>
    )}

    {tabs && (
      <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-[8px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange?.(tab.value)}
            className={`px-2.5 h-[26px] rounded-[6px] text-[12px] font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === tab.value ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(0,0,0,0.04)]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-[10px] px-1 rounded-full bg-[#E2E8F0] text-[#475569]">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    )}

    {actions && <div className="flex items-center gap-2 ml-auto">{actions}</div>}
  </div>
);
