import React from 'react'
import { X } from 'lucide-react'
import { Drawer } from '@/components/navigation/Drawer'

interface UtilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const UtilityPanel: React.FC<UtilityPanelProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} position="right" width="w-[340px]">
      <div className="px-5 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 h-[72px]">
        <h2 className="text-[14px] font-semibold text-[#0F172A]">Utility Panel</h2>
        <button onClick={onClose} className="text-[#94A3B8] hover:text-[#475569] transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-8 scrollbar-none">
        
        {/* Recent Activity */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase">
            Recent Activity
          </h3>
          <div className="p-6 border-[1.5px] border-dashed border-[#CBD5E1] rounded-[16px] flex items-center justify-center text-[13px] text-[#94A3B8]">
            No recent activity
          </div>
        </div>

        {/* Quick Notes */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase">
            Quick Notes
          </h3>
          <div className="p-5 border-[1.5px] border-dashed border-[#CBD5E1] rounded-[16px] text-[13px] text-[#94A3B8] text-center leading-relaxed">
            Nothing pinned yet — notes you add will appear here.
          </div>
        </div>

        {/* Pinned Alerts */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase">
            Pinned Alerts
          </h3>
          <div className="p-6 border-[1.5px] border-dashed border-[#CBD5E1] rounded-[16px] flex items-center justify-center text-[13px] text-[#94A3B8]">
            No pinned alerts
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[11px] font-semibold tracking-[0.06em] text-[#94A3B8] uppercase">
            Upcoming Events
          </h3>
          <div className="p-6 border-[1.5px] border-dashed border-[#CBD5E1] rounded-[16px] flex items-center justify-center text-[13px] text-[#94A3B8]">
            No upcoming events
          </div>
        </div>

      </div>
    </Drawer>
  )
}

