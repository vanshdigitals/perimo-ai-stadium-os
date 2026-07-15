import React from 'react';
import { cn } from '@/utils/cn';
import { UtilityHeader } from './UtilityHeader';
import { UtilityFooter } from './UtilityFooter';
import { QuickActions } from './QuickActions';
import { PinnedAlerts } from './PinnedAlerts';
import { QuickNotes } from './QuickNotes';
import { RecentActivity } from './RecentActivity';
import { UpcomingEvents } from './UpcomingEvents';
import { OperatorTasks } from './OperatorTasks';

interface UtilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({ isOpen, onClose, isMobile, isTablet }) => {
  const isDesktop = !isMobile && !isTablet;

  // On desktop, we don't hide it with transform if it's "isOpen".
  // Actually, standard enterprise apps often have a togglable right sidebar. 
  // If it's closed on desktop, it slides out. 
  
  return (
    <>
      <aside
        className={cn(
          "bg-white flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          // Desktop Fixed Right Overlay Rail
          isDesktop && "fixed right-0 top-[72px] bottom-0 w-[340px] border-l border-[#E2E8F0] z-[1000]",
          isDesktop && !isOpen && "translate-x-full shadow-none",
          isDesktop && isOpen && "translate-x-0 shadow-2xl",
          
          // Tablet Overlay Drawer
          isTablet && "fixed right-0 top-[72px] bottom-0 w-[340px] border-l border-[#E2E8F0] z-[1000]",
          isTablet && !isOpen && "translate-x-full shadow-none",
          isTablet && isOpen && "translate-x-0 shadow-2xl",
          
          // Mobile Bottom Sheet
          isMobile && "fixed left-0 right-0 bottom-0 top-auto h-[75vh] w-full rounded-t-[16px] border-t border-[#E2E8F0] z-[1000]",
          isMobile && !isOpen && "translate-y-full shadow-none",
          isMobile && isOpen && "translate-y-0 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]"
        )}
      >
        <UtilityHeader onClose={onClose} showClose={!isDesktop} />
        
        <div className="flex-1 overflow-y-auto utility-scrollbar p-5 flex flex-col gap-6 bg-[#F8FAFC]">
          
          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase">Quick Actions</h3>
            <QuickActions />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase">Pinned Alerts</h3>
            <PinnedAlerts />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase">Operator Tasks</h3>
            <OperatorTasks />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase">Quick Notes</h3>
            <QuickNotes />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase flex justify-between items-center">
              Upcoming Events
              <span className="text-[#3B82F6] cursor-pointer hover:underline text-[10px] normal-case tracking-normal">Schedule</span>
            </h3>
            <UpcomingEvents />
          </div>

          <div className="flex flex-col gap-3 pb-2">
            <h3 className="text-[11px] font-bold tracking-[0.06em] text-[#64748B] uppercase">Recent Activity</h3>
            <RecentActivity />
          </div>

        </div>

        <UtilityFooter />
      </aside>
    </>
  );
};
