import React from 'react';
import { CheckCircle2, Radio, UserCog, Layers, Bot } from 'lucide-react';
import { useUtilityWidget } from '../hooks/useUtilityWidget';
import { ActivityService, type Activity } from '../services/ActivityService';
import { cn } from '@/utils/cn';

const getIcon = (type: string) => {
  switch(type) {
    case 'resolved': return { icon: CheckCircle2, color: 'text-[#10B981]' };
    case 'broadcast': return { icon: Radio, color: 'text-[#3B82F6]' };
    case 'role': return { icon: UserCog, color: 'text-[#94A3B8]' };
    case 'map': return { icon: Layers, color: 'text-[#94A3B8]' };
    case 'ai': return { icon: Bot, color: 'text-[#8B5CF6]' };
    default: return { icon: Radio, color: 'text-[#94A3B8]' };
  }
};

export const RecentActivity: React.FC = () => {
  const { data: activities, state } = useUtilityWidget<Activity[]>(
    ActivityService.getRecentActivity,
    (data) => data.length === 0
  );

  if (state === 'loading') {
    return <div className="h-32 bg-[#E2E8F0] rounded-[8px] animate-pulse" />;
  }

  if (state === 'empty') {
    return <div className="text-[13px] text-[#94A3B8] text-center py-4">No recent activity</div>;
  }

  return (
    <div className="flex flex-col gap-4 pl-1">
      {activities?.map((activity, index) => {
        const { icon: Icon, color } = getIcon(activity.type);
        return (
          <div key={activity.id} className="flex gap-3 relative">
            {index !== activities.length - 1 && (
              <div className="absolute left-[7px] top-5 w-px h-[calc(100%+8px)] bg-[#E2E8F0]" />
            )}
            <div className={cn("w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5", color)}>
              <Icon className="w-full h-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-[#334155] leading-snug">{activity.text}</span>
              <span className="text-[11px] font-medium text-[#94A3B8] mt-0.5">{activity.time}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
