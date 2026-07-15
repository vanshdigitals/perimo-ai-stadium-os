import React from 'react';
import { X } from 'lucide-react';

interface UtilityHeaderProps {
  onClose?: () => void;
  showClose?: boolean;
}

export const UtilityHeader: React.FC<UtilityHeaderProps> = ({ onClose, showClose }) => {
  return (
    <div className="px-5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 h-[72px] bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-[14px] font-semibold text-[#0F172A]">Operations Rail</h2>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-bold text-[#065F46] uppercase tracking-wider">Live</span>
        </div>
      </div>
      {showClose && onClose && (
        <button 
          onClick={onClose} 
          className="text-[#94A3B8] hover:text-[#475569] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
