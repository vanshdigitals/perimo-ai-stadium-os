import React from 'react';
import { StickyNote } from 'lucide-react';
import { useUtilityWidget } from '../hooks/useUtilityWidget';
import { NotesService, type Note } from '../services/NotesService';

export const QuickNotes: React.FC = () => {
  const { data: notes, state } = useUtilityWidget<Note[]>(
    NotesService.getNotes,
    (data) => data.length === 0
  );

  if (state === 'loading') {
    return (
      <div className="flex flex-col gap-2">
        <div className="h-20 bg-[#FEF9C3] rounded-[8px] animate-pulse opacity-50" />
      </div>
    );
  }

  if (state === 'empty') {
    return <div className="text-[13px] text-[#94A3B8] text-center py-4">No quick notes</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {notes?.map(note => (
        <div key={note.id} className="p-3 bg-[#FEF9C3] border border-[#FEF08A] rounded-[8px] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#EAB308]" />
          <div className="flex items-center gap-1.5 mb-1.5">
            <StickyNote className="w-3.5 h-3.5 text-[#CA8A04]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#CA8A04]">{note.type}</span>
          </div>
          <p className="text-[12px] text-[#854D0E] font-medium leading-relaxed mb-1">{note.text}</p>
          <div className="text-[10px] text-[#A16207] text-right font-semibold">~ {note.author}</div>
        </div>
      ))}
    </div>
  );
};
