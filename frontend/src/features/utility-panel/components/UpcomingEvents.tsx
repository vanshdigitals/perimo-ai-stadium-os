import React from 'react';
import { Clock, MapPin, Users, Bus } from 'lucide-react';
import { useUtilityWidget } from '../hooks/useUtilityWidget';
import { ScheduleService, type Event } from '../services/ScheduleService';

const getIcon = (type: string) => {
  switch(type) {
    case 'match': return Clock;
    case 'gate': return MapPin;
    case 'shift': return Users;
    case 'transport': return Bus;
    default: return Clock;
  }
};

export const UpcomingEvents: React.FC = () => {
  const { data: events, state } = useUtilityWidget<Event[]>(
    ScheduleService.getUpcomingEvents,
    (data) => data.length === 0
  );

  if (state === 'loading') {
    return <div className="h-32 bg-[#E2E8F0] rounded-[8px] animate-pulse" />;
  }

  if (state === 'empty') {
    return <div className="text-[13px] text-[#94A3B8] text-center py-4">No upcoming events</div>;
  }

  return (
    <div className="flex flex-col bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden divide-y divide-[#F1F5F9]">
      {events?.map(event => {
        const Icon = getIcon(event.type);
        return (
          <div key={event.id} className="flex items-center justify-between p-3 hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 text-[#94A3B8]" />
              <span className="text-[13px] font-medium text-[#334155]">{event.text}</span>
            </div>
            <span className="text-[11px] font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-[4px]">{event.time}</span>
          </div>
        );
      })}
    </div>
  );
};
