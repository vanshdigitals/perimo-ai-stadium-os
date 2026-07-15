export interface OperatorTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export const TaskService = {
  getTasks: async (): Promise<OperatorTask[]> => {
    await new Promise(r => setTimeout(r, 600));
    
    return [
      { id: '1', title: 'Verify Gate C sensors', status: 'pending' },
      { id: '2', title: 'Restock Medical Kit B', status: 'in_progress' },
      { id: '3', title: 'Submit Shift Report', status: 'pending' },
    ];
  },
  
  updateTask: async (_id: string, _status: OperatorTask['status']): Promise<void> => {
    await new Promise(r => setTimeout(r, 300));
  }
};
