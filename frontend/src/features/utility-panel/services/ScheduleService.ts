export interface Event {
  id: string;
  type: 'match' | 'gate' | 'shift' | 'transport';
  text: string;
  time: string;
}

export const ScheduleService = {
  getUpcomingEvents: async (): Promise<Event[]> => {
    await new Promise(r => setTimeout(r, 500));
    
    return [
      { id: '1', type: 'match', text: 'Kickoff', time: 'In 45 mins' },
      { id: '2', type: 'gate', text: 'Gates open to public', time: '16:00' },
      { id: '3', type: 'shift', text: 'Team Alpha handoff', time: '17:30' },
      { id: '4', type: 'transport', text: 'Buses arriving at North Hub', time: '18:00' },
    ];
  }
};
