import React, { type ReactNode } from 'react';
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary';

interface FanScreenProps {
  children: ReactNode;
  header?: ReactNode;
  isFluid?: boolean;
}

export const FanScreen: React.FC<FanScreenProps> = ({ children, header, isFluid = false }) => {
  return (
    <div className="flex flex-col min-h-screen lg:min-h-0 w-full overflow-y-auto">
      {header && (
        <div className="sticky top-[64px] lg:top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm shadow-slate-900/5">
          {header}
        </div>
      )}
      
      <div className={`flex-1 w-full mx-auto ${isFluid ? '' : 'max-w-[1200px] p-4 lg:p-8'}`}>
        <WidgetErrorBoundary fallbackTitle="Module Unavailable">
          {children}
        </WidgetErrorBoundary>
      </div>
    </div>
  );
};
