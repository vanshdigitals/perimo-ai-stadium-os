import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

export const EmergencyFAB: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/fan/emergency') return null;

  return (
    <button
      onClick={() => navigate('/fan/emergency')}
      className={cn(
        "fixed z-50 flex items-center justify-center w-14 h-14 rounded-full",
        "bg-red-500 text-white shadow-xl shadow-red-500/25",
        "hover:bg-red-600 hover:scale-105 transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/30",
        "bottom-[100px] lg:bottom-8 right-4 lg:right-8"
      )}
      aria-label="Emergency"
    >
      <ShieldAlert className="w-6 h-6" strokeWidth={2.5} />
    </button>
  );
};
