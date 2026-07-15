// Fallback mock data
export interface Alert {
  id: string;
  text: string;
  level: 'critical' | 'warning';
  type: string;
}

export const AlertService = {
  getPinnedAlerts: async (): Promise<Alert[]> => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 600));
    
    // Fallback Mock
    return [
      { id: '1', type: 'medical', text: 'Medical emergency Sec 112', level: 'critical' },
      { id: '2', type: 'crowd', text: 'Gate B over capacity (115%)', level: 'warning' },
      { id: '3', type: 'system', text: 'Camera 42 offline', level: 'warning' },
    ];
  }
};
