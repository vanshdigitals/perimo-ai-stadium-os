import React from 'react';
import type { QuickAction } from '../api';
import { MapPin, Coffee, AlertCircle, Sparkles, Navigation, Ticket, ShoppingBag, ShieldAlert, HeartPulse } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ICON_MAP: Record<string, React.ElementType> = {
  'map-pin': MapPin,
  'coffee': Coffee,
  'alert-circle': AlertCircle,
  'sparkles': Sparkles,
  'navigation': Navigation,
  'ticket': Ticket,
  'shopping-bag': ShoppingBag,
  'shield-alert': ShieldAlert,
  'heart-pulse': HeartPulse
};

export const QuickActionTile: React.FC<{ action: QuickAction; index: number }> = ({ action, index }) => {
  const navigate = useNavigate();
  const Icon = ICON_MAP[action.icon] || MapPin;

  // AI actions use the AI Accent token #6B4EFF, others use Brand or standard grey
  const isAI = action.icon === 'sparkles';
  const bgClass = isAI ? 'bg-[#F5F3FF]' : 'bg-[#F8FAFC]';
  const iconColor = isAI ? 'text-[#6B4EFF]' : 'text-[#2563EB]';
  const borderColor = isAI ? 'border-[#EBE4FF]' : 'border-[#E2E4E9]';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(action.path)}
      className={`flex flex-col items-center justify-center gap-3 bg-white border ${borderColor} rounded-[20px] p-4 min-h-[96px] shadow-sm hover:shadow-md transition-shadow text-center w-full`}
    >
      <div className={`w-12 h-12 rounded-[16px] flex items-center justify-center ${bgClass}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
      </div>
      <span className="text-xs font-semibold text-[#0F172A] tracking-tight">{action.label}</span>
    </motion.button>
  );
};
