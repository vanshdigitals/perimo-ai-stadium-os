import React from 'react';
import type { TicketPreview } from '../api';
import { QrCode, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TicketPreviewCard: React.FC<{ ticket: TicketPreview }> = ({ ticket }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate('/fan/ticket')}
      className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl shadow-blue-900/20"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-display font-bold text-lg">Your Ticket</h3>
          <p className="text-white/80 text-sm">Valid Entry</p>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
          <QrCode className="w-5 h-5 text-white" />
        </div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-0.5">Gate</p>
            <p className="font-bold text-xl">{ticket.gate.name}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-0.5">Sec</p>
            <p className="font-bold text-xl">{ticket.seat.section}</p>
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase font-bold tracking-wider mb-0.5">Seat</p>
            <p className="font-bold text-xl">{ticket.seat.row}{ticket.seat.number}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-white/50" />
      </div>
    </div>
  );
};
