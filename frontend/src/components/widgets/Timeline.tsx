import React from 'react';
import { EmptyState } from './EmptyState';

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description?: string;
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

const TONE_COLOR: Record<NonNullable<TimelineEvent['tone']>, string> = {
  success: '#1FAA6D',
  warning: '#D68A00',
  danger: '#C4291C',
  info: '#2563EB',
  neutral: '#94A3B8',
};

/** Vertical event timeline — Activity Timeline / Response Timeline / Decision
 *  History / etc. across every module render through this one component. */
export const Timeline: React.FC<{ events: TimelineEvent[]; emptyLabel?: string }> = ({ events, emptyLabel = 'No activity yet.' }) => {
  if (events.length === 0) return <EmptyState message={emptyLabel} />;

  return (
    <div className="flex flex-col">
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
          {i < events.length - 1 && <div className="absolute left-[5px] top-4 bottom-0 w-px bg-[#E2E8F0]" />}
          <div
            className="shrink-0 w-[10px] h-[10px] rounded-full border-2 border-white mt-1 shadow-sm"
            style={{ backgroundColor: TONE_COLOR[event.tone ?? 'neutral'] }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <span className="text-[13px] font-medium text-[#0F172A] truncate">{event.title}</span>
              <span className="text-[11px] font-mono text-[#94A3B8] shrink-0">{event.time}</span>
            </div>
            {event.description && <p className="text-[12px] text-[#64748B] leading-relaxed">{event.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
