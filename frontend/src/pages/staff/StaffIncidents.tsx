import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard, DataTable, type DataTableColumn } from '@/components/widgets'
import { AlertTriangle, Navigation, Radio, MapPin, Camera, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'
import { cn } from '@/utils/cn'

interface Incident {
  id: string
  title: string
  location: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  time: string
  status: 'Unassigned' | 'Responding' | 'Resolved'
  assignedToMe?: boolean
}

const MOCK_INCIDENTS: Incident[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `INC-20${i}`,
  title: ['Medical Emergency', 'Unruly Fan', 'Suspicious Package', 'Lost Child', 'Spill'][i % 5],
  location: `Sector ${100 + i}`,
  severity: ['Critical', 'High', 'Medium', 'Low'][i % 4] as any,
  time: `${Math.floor(i / 2)}m ago`,
  status: ['Unassigned', 'Responding', 'Resolved'][i % 3] as any,
  assignedToMe: i % 3 === 1
}))

export const StaffIncidents: React.FC = () => {
  const { toast } = useApp()
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS)
  const [activeTab, setActiveTab] = useState<'assigned' | 'nearby'>('assigned')

  const handleRespond = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Responding', assignedToMe: true } : i))
    toast({ type: 'success', title: 'Dispatch Confirmed', message: 'You are now responding to ' + id })
  }

  const handleResolve = (id: string) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status: 'Resolved' } : i))
    toast({ type: 'success', title: 'Incident Resolved', message: id + ' has been closed.' })
  }

  const displayedIncidents = incidents.filter(i => 
    activeTab === 'assigned' ? i.assignedToMe && i.status !== 'Resolved' : !i.assignedToMe && i.status !== 'Resolved'
  )

  const columns: DataTableColumn<Incident>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (row) => <span className="font-mono text-[12px] font-bold text-[#64748B]">{row.id}</span>
    },
    {
      key: 'title',
      header: 'Incident',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-[#0F172A] mb-0.5">{row.title}</span>
          <span className="text-[12px] text-[#64748B] flex items-center gap-1"><MapPin className="w-3 h-3" /> {row.location}</span>
        </div>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      render: (row) => (
        <span className={cn(
          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 w-max",
          row.severity === 'Critical' ? "bg-red-100 text-red-700" :
          row.severity === 'High' ? "bg-orange-100 text-orange-700" :
          row.severity === 'Medium' ? "bg-yellow-100 text-yellow-700" :
          "bg-blue-100 text-blue-700"
        )}>
          {row.severity === 'Critical' && <AlertOctagon className="w-3 h-3" />}
          {row.severity}
        </span>
      )
    },
    {
      key: 'time',
      header: 'Reported',
      sortable: true,
      render: (row) => <span className="text-[12px] text-[#64748B]">{row.time}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'Unassigned' ? (
            <button onClick={(e) => { e.stopPropagation(); handleRespond(row.id) }} className="h-8 px-4 rounded-[6px] bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" /> Respond
            </button>
          ) : row.status === 'Responding' ? (
            <>
              <button className="h-8 w-8 flex items-center justify-center rounded-[6px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] transition-colors" title="Radio Command">
                <Radio className="w-4 h-4" />
              </button>
              <button className="h-8 w-8 flex items-center justify-center rounded-[6px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] transition-colors" title="Capture Evidence">
                <Camera className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleResolve(row.id) }} className="h-8 px-4 rounded-[6px] bg-[#10B981] text-white text-[12px] font-semibold hover:bg-[#059669] transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resolve
              </button>
            </>
          ) : null}
        </div>
      )
    }
  ]

  return (
    <StaffLayout>
      <PageHeader 
        title="Incident Response" 
        subtitle="Manage and respond to live stadium incidents."
        actions={
          <button onClick={() => toast({ type: 'info', title: 'Report Incident', message: 'Opening incident form...' })} className="h-[36px] px-4 rounded-[8px] bg-red-600 text-white font-medium text-[13px] hover:bg-red-700 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Report Incident
          </button>
        }
      />

      <WidgetCard title="Dispatch Center" icon={AlertTriangle} iconColor="#DC2626" className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
        
        <div className="flex gap-4 border-b border-[#E2E8F0] mb-4 shrink-0 px-2">
          <button 
            onClick={() => setActiveTab('assigned')}
            className={cn("pb-3 text-[13px] font-bold border-b-2 transition-colors", activeTab === 'assigned' ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]")}
          >
            My Assigned ({incidents.filter(i => i.assignedToMe && i.status !== 'Resolved').length})
          </button>
          <button 
            onClick={() => setActiveTab('nearby')}
            className={cn("pb-3 text-[13px] font-bold border-b-2 transition-colors", activeTab === 'nearby' ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-[#64748B] hover:text-[#0F172A]")}
          >
            Nearby Unassigned ({incidents.filter(i => !i.assignedToMe && i.status !== 'Resolved').length})
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <DataTable 
            columns={columns}
            rows={displayedIncidents}
            keyField={(row) => row.id}
            emptyLabel={activeTab === 'assigned' ? "You have no assigned incidents." : "No nearby unassigned incidents."}
            pageSize={8}
          />
        </div>

      </WidgetCard>
    </StaffLayout>
  )
}
