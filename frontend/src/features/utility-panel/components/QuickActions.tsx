import React from 'react';
import { Mic, Bot, CheckSquare, Map, Users } from 'lucide-react';
import { CommandService } from '../services/CommandService';

export const QuickActions: React.FC = () => {
  const quickActions = [
    { id: 1, icon: Mic, text: 'Broadcast', action: () => CommandService.broadcast('alert') },
    { id: 2, icon: Bot, text: 'AI Copilot', action: () => console.log('Open Copilot') },
    { id: 3, icon: CheckSquare, text: 'Resolve', action: () => CommandService.resolve('1') },
    { id: 4, icon: Map, text: 'Map View', action: () => console.log('Open Map') },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {quickActions.map(action => (
        <button 
          key={action.id}
          onClick={action.action}
          className="flex items-center gap-2 p-2.5 bg-white border border-[#E2E8F0] rounded-[8px] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <action.icon className="w-4 h-4 text-[#64748B] group-hover:text-[#0F172A] shrink-0" />
          <span className="text-[12px] font-medium text-[#334155] group-hover:text-[#0F172A] leading-none">{action.text}</span>
        </button>
      ))}
      <button 
        onClick={() => CommandService.deploy('team-1', 'gate-a')}
        className="col-span-2 flex items-center justify-center gap-2 p-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-[8px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
      >
        <Users className="w-4 h-4" />
        <span className="text-[12px] font-medium leading-none">Deploy Response Team</span>
      </button>
    </div>
  );
};
