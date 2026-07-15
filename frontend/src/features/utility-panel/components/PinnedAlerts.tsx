import React, { useCallback } from 'react';
import { AlertCircle, AlertTriangle, WifiOff } from 'lucide-react';
import { useUtilityWidget } from '../hooks/useUtilityWidget';
import { useUtilitySockets } from '../hooks/useUtilitySockets';
import { AlertService, type Alert } from '../services/AlertService';
import { cn } from '@/utils/cn';

const getIcon = (type: string) => {
  switch(type) {
    case 'medical': return AlertCircle;
    case 'system': return WifiOff;
    default: return AlertTriangle;
  }
};

export const PinnedAlerts: React.FC = () => {
  const { data: alerts, state, updateData } = useUtilityWidget<Alert[]>(
    AlertService.getPinnedAlerts,
    (data) => data.length === 0
  );

  const handleNewAlert = useCallback((newAlert: Alert) => {
    if (alerts) {
      updateData([newAlert, ...alerts]);
    }
  }, [alerts, updateData]);

  useUtilitySockets('new_alert', handleNewAlert);

  if (state === 'loading') {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-12 bg-[#E2E8F0] rounded-[8px] animate-pulse" />
        <div className="h-12 bg-[#E2E8F0] rounded-[8px] animate-pulse" />
      </div>
    );
  }

  if (state === 'empty') {
    return <div className="text-[13px] text-[#94A3B8] text-center py-4">No pinned alerts</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {alerts?.map(alert => {
        const Icon = getIcon(alert.type);
        return (
          <div 
            key={alert.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-[8px] border transition-all",
              alert.level === 'critical' 
                ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]"
                : "bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]"
            )}
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="text-[13px] font-medium leading-snug">{alert.text}</span>
          </div>
        );
      })}
    </div>
  );
};
