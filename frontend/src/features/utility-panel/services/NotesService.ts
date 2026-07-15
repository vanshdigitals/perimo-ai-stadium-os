export interface Note {
  id: string;
  type: 'handoff' | 'emergency' | 'instruction';
  text: string;
  author: string;
}

export const NotesService = {
  getNotes: async (): Promise<Note[]> => {
    await new Promise(r => setTimeout(r, 450));
    
    return [
      { id: '1', type: 'handoff', text: 'VIP entering through Gate D at 14:00. Ensure clear path.', author: 'Shift 1' },
      { id: '2', type: 'emergency', text: 'Radios on Channel 4 today due to interference.', author: 'Admin' },
    ];
  },

  createNote: async (note: Omit<Note, 'id'>): Promise<Note> => {
    await new Promise(r => setTimeout(r, 300));
    return { ...note, id: Math.random().toString(36).substring(7) };
  }
};
