import React from 'react';
import type { TicketPreview } from '../api';
import { motion } from 'framer-motion';
import { QrCode, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroTicketCard: React.FC<{ ticket: TicketPreview }> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <motion.button 
      onClick={() => navigate('/fan/ticket')}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="w-full text-left bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-[24px] p-6 lg:p-8 text-white relative overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.2)] group border border-white/10 max-w-[480px] mx-auto lg:mx-0"
    >
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
        className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
      />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h3 className="font-display font-bold text-xl lg:text-2xl tracking-tight mb-1">Your Ticket</h3>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-[11px] font-bold uppercase tracking-wider border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Valid Entry
          </span>
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner">
          <QrCode className="w-6 h-6 text-[#2563EB]" />
        </div>
      </div>
      
      <div className="flex justify-between items-end relative z-10">
        <div className="flex gap-6 lg:gap-8">
          <div>
            <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">Gate</p>
            <p className="font-bold text-2xl lg:text-3xl tracking-tight leading-none">{ticket.gate.name}</p>
          </div>
          <div>
            <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">Sec</p>
            <p className="font-bold text-2xl lg:text-3xl tracking-tight leading-none">{ticket.seat.section}</p>
          </div>
          <div>
            <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mb-0.5">Seat</p>
            <p className="font-bold text-2xl lg:text-3xl tracking-tight leading-none">{ticket.seat.row}{ticket.seat.number}</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.button>
  );
};
