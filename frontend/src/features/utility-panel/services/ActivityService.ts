export interface Activity {
  id: string;
  type: 'resolved' | 'broadcast' | 'role' | 'map' | 'ai';
  text: string;
  time: string;
}

export const ActivityService = {
  getRecentActivity: async (): Promise<Activity[]> => {
    await new Promise(r => setTimeout(r, 800));
    
    return [
      { id: '1', type: 'resolved', text: 'Gate A Congestion Cleared', time: '2m ago' },
      { id: '2', type: 'broadcast', text: 'PA System: Medical', time: '12m ago' },
      { id: '3', type: 'role', text: 'Role: Security Operator', time: '15m ago' },
      { id: '4', type: 'map', text: 'Heatmap Layer Activated', time: '1h ago' },
      { id: '5', type: 'ai', text: 'Flow redirected to Gate C', time: '1h 10m ago' },
    ];
  }
};
