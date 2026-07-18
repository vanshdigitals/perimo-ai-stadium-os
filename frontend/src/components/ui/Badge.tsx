import React from 'react';
import { cn } from '@/utils/cn';
import type { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'success' | 'brand' | 'purple' | 'dark' | 'outline' | 'custom';

export interface BadgeProps {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  label: string;
  className?: string;
  customColor?: string;
  isDark?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'outline', 
  icon: Icon, 
  label, 
  className,
  customColor,
  isDark = true
}) => {
  const baseClasses = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-colors";
  
  let variantClasses = "";
  let customStyle = {};

  switch (variant) {
    case 'success':
      variantClasses = isDark ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#10B981]/10 text-[#059669] border-[#10B981]/20";
      break;
    case 'brand':
      variantClasses = isDark ? "bg-[#2563EB]/10 text-[#3B82F6] border-[#2563EB]/20" : "bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/20";
      break;
    case 'purple':
      variantClasses = isDark ? "bg-[#8B5CF6]/10 text-[#A78BFA] border-[#8B5CF6]/20" : "bg-[#8B5CF6]/10 text-[#7C3AED] border-[#8B5CF6]/20";
      break;
    case 'dark':
      variantClasses = isDark ? "bg-white/10 text-[#CBD5E1] border-white/10" : "bg-black/5 text-[#475569] border-black/10";
      break;
    case 'outline':
      variantClasses = isDark ? "bg-white/5 text-[#9AA3B2] border-white/5" : "bg-black/[0.03] text-[#64748B] border-black/[0.05]";
      break;
    case 'custom':
      if (customColor) {
        customStyle = { backgroundColor: `${customColor}15`, color: customColor, borderColor: `${customColor}25` };
      }
      break;
  }

  return (
    <div className={cn(baseClasses, variantClasses, className)} style={customStyle}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </div>
  );
};
