import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface OpsCardProps {
  isDark: boolean;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  themeColor: string;
  onClick: () => void;
}

export const OpsCard: React.FC<OpsCardProps> = ({ 
  isDark, 
  title, 
  description, 
  icon: Icon, 
  badge,
  themeColor,
  onClick 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative w-full h-auto min-h-[220px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between",
        isDark ? "bg-[#141822] border border-[#232838] hover:border-[#334155] shadow-xl hover:shadow-2xl" : "bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xl hover:shadow-2xl"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm shrink-0"
          style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
        >
          <Icon className="w-6 h-6" />
        </div>
        <Badge variant="custom" customColor={themeColor} label={badge} isDark={isDark} />
      </div>

      <div className="mt-6 sm:mt-0">
        <h3 className={cn("text-xl sm:text-2xl font-bold tracking-tight mb-2 sm:mb-3", isDark ? "text-white" : "text-[#0F172A]")}>
          {title}
        </h3>
        <p className={cn("text-[13px] sm:text-[14px] leading-relaxed mb-5 sm:mb-6", isDark ? "text-[#94A3B8]" : "text-[#64748B]")}>
          {description}
        </p>

        <div className={cn("flex items-center justify-between sm:justify-start gap-2 group-hover:gap-3 transition-all duration-300 rounded-xl sm:rounded-none px-4 py-3 sm:p-0", isDark ? "bg-white/5 sm:bg-transparent" : "bg-black/5 sm:bg-transparent")}>
          <span className={cn("font-semibold text-[13px] sm:text-[14px]", isDark ? "text-[#CBD5E1]" : "text-[#334155]")}>Access Portal</span>
          <ArrowRight className="w-4 h-4 opacity-70 sm:opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
