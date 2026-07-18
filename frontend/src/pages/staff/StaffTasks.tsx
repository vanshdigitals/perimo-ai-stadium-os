import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard, DataTable, type DataTableColumn } from '@/components/widgets'
import { Search, Filter, CheckCircle, Clock, Navigation } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'

type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Escalated'

interface Task {
  id: string
  title: string
  location: string
  priority: 'High' | 'Medium' | 'Low'
  dueTime: string
  status: TaskStatus
}

const MOCK_TASKS: Task[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `T-${100 + i}`,
  title: ['Crowd Control', 'Restock Medical', 'Perimeter Check', 'Evacuation Assist', 'Equipment Setup'][i % 5] + ` at Sector ${i % 10}`,
  location: `Zone ${Math.floor(i / 5) + 1}`,
  priority: ['High', 'Medium', 'Low'][i % 3] as any,
  dueTime: `${Math.floor(10 + (i % 8))}:00`,
  status: ['Pending', 'In Progress', 'Completed', 'Escalated'][i % 4] as any
}))

export const StaffTasks: React.FC = () => {
  const { toast } = useApp()
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All')

  const handleAction = (taskId: string, action: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    toast({ type: 'success', title: 'Task Updated', message: `Task ${taskId} marked as ${action}.` })
  }

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const columns: DataTableColumn<Task>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (row) => <span className="font-mono text-[12px] font-bold text-[#64748B]">{row.id}</span>
    },
    {
      key: 'title',
      header: 'Task Details',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0F172A] mb-0.5">{row.title}</span>
          <span className="text-[12px] text-[#64748B] flex items-center gap-1"><Navigation className="w-3 h-3" /> {row.location}</span>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      sortable: true,
      render: (row) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
          row.priority === 'High' ? "bg-red-100 text-red-700" :
          row.priority === 'Medium' ? "bg-orange-100 text-orange-700" :
          "bg-slate-100 text-slate-700"
        )}>{row.priority}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
          row.status === 'Completed' ? "bg-emerald-100 text-emerald-700" :
          row.status === 'In Progress' ? "bg-blue-100 text-blue-700" :
          row.status === 'Escalated' ? "bg-purple-100 text-purple-700" :
          "bg-slate-100 text-slate-700"
        )}>{row.status}</span>
      )
    },
    {
      key: 'dueTime',
      header: 'Due',
      sortable: true,
      render: (row) => <span className="flex items-center gap-1 text-[12px]"><Clock className="w-3.5 h-3.5 text-[#64748B]" /> {row.dueTime}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'Pending' && (
            <button onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'Started', 'In Progress') }} className="h-8 px-3 rounded-[6px] bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors">
              Start
            </button>
          )}
          {row.status === 'In Progress' && (
            <>
              <button onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'Paused', 'Pending') }} className="h-8 px-3 rounded-[6px] bg-[#F1F5F9] text-[#475569] text-[12px] font-semibold hover:bg-[#E2E8F0] transition-colors">
                Pause
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'Completed', 'Completed') }} className="h-8 px-3 rounded-[6px] bg-[#10B981] text-white text-[12px] font-semibold hover:bg-[#059669] transition-colors">
                Done
              </button>
            </>
          )}
          {row.status !== 'Completed' && row.status !== 'Escalated' && (
            <button onClick={(e) => { e.stopPropagation(); handleAction(row.id, 'Escalated', 'Escalated') }} className="h-8 px-3 rounded-[6px] border border-[#E2E8F0] bg-white text-[#E5342B] text-[12px] font-semibold hover:bg-[#FEF2F2] hover:border-[#FCA5A5] transition-colors">
              Escalate
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <StaffLayout>
      <PageHeader title="My Tasks" subtitle="Manage your assigned tasks and operations." />

      <WidgetCard title="Task Management" icon={CheckCircle} iconColor="#2563EB" className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-[8px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
          <div className="relative shrink-0 w-full sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full h-10 pl-9 pr-4 rounded-[8px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] appearance-none bg-white cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 min-h-0">
          <DataTable 
            columns={columns}
            rows={filteredTasks}
            keyField={(row) => row.id}
            emptyLabel="No tasks found matching your criteria."
            pageSize={8}
          />
        </div>
      </WidgetCard>
    </StaffLayout>
  )
}
