import React from 'react';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Badge } from '@/components/ui/Badge';

interface AdminCardProps {
  onClick: () => void;
}

export const AdminCard: React.FC<AdminCardProps> = ({ onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative w-full h-auto min-h-[220px] rounded-[32px] overflow-hidden cursor-pointer transition-all duration-300 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8",
        "bg-gradient-to-br from-[#0F172A] to-[#020617] border border-[#1E293B] hover:border-[#334155] shadow-2xl"
      )}
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2563EB]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start gap-4 sm:gap-6 relative z-10 w-full">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg bg-white/5 border border-white/10 shrink-0 mb-2 md:mb-0">
          <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-[#94A3B8]" />
        </div>
        
        <div className="flex flex-col items-start gap-2 sm:gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-2 sm:gap-3">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Command Center
            </h3>
            <Badge variant="dark" icon={Lock} label="Enterprise Access" className="w-fit" isDark={true} />
          </div>
          <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#94A3B8] max-w-[600px] mt-1 sm:mt-0">
            Centralized stadium control. Global infrastructure monitoring, AI security threat analysis, and top-level operational dashboards. Restricted access.
          </p>
        </div>
      </div>

      <div className="relative z-10 shrink-0 w-full md:w-auto mt-2 md:mt-0">
        <div className="flex items-center justify-center md:justify-start gap-3 h-12 w-full px-6 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-[14px] group-hover:bg-white/10 transition-colors">
          <span>Admin Login</span>
          <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};
