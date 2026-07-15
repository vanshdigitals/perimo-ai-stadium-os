import React from 'react';
import { Circle, CheckCircle2 } from 'lucide-react';
import { useUtilityWidget } from '../hooks/useUtilityWidget';
import { TaskService, type OperatorTask } from '../services/TaskService';

export const OperatorTasks: React.FC = () => {
  const { data: tasks, state, updateData } = useUtilityWidget<OperatorTask[]>(
    TaskService.getTasks,
    (data) => data.length === 0
  );

  const toggleTask = (id: string, currentStatus: string) => {
    if (!tasks) return;
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // Optimistic update
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, status: newStatus as any } : t);
    updateData(updatedTasks);
    
    // Fire and forget to backend
    TaskService.updateTask(id, newStatus);
  };

  if (state === 'loading') {
    return <div className="h-24 bg-[#E2E8F0] rounded-[8px] animate-pulse" />;
  }

  if (state === 'empty') {
    return <div className="text-[13px] text-[#94A3B8] text-center py-4">No pending tasks</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {tasks?.map(task => (
        <button 
          key={task.id}
          onClick={() => toggleTask(task.id, task.status)}
          className="flex items-start gap-2.5 p-2 rounded-[8px] hover:bg-[#F1F5F9] transition-colors text-left group"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          ) : (
            <Circle className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#94A3B8] shrink-0 mt-0.5 transition-colors" />
          )}
          <span className={`text-[13px] font-medium leading-snug ${task.status === 'completed' ? 'text-[#94A3B8] line-through' : 'text-[#334155]'}`}>
            {task.title}
          </span>
        </button>
      ))}
    </div>
  );
};
