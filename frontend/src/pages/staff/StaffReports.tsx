import React, { useState } from 'react'
import { StaffLayout } from '@/components/layouts/StaffLayout'
import { PageHeader, WidgetCard, DataTable, type DataTableColumn } from '@/components/widgets'
import { FileText, Plus, FileEdit, CheckCircle2, Download } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

interface Report {
  id: string
  title: string
  date: string
  status: 'Draft' | 'Submitted'
  type: 'End of Shift' | 'Incident'
}

const MOCK_REPORTS: Report[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `R-${300 + i}`,
  title: ['End of Shift: North Concourse', 'Incident Log: Gate C Escalation', 'End of Shift: VIP East', 'Maintenance Log: Scanner Malfunction'][i % 4],
  date: `Jul ${15 - (i % 5)}, 2026`,
  status: ['Submitted', 'Draft', 'Submitted'][i % 3] as any,
  type: ['End of Shift', 'Incident', 'End of Shift'][i % 3] as any
}))

export const StaffReports: React.FC = () => {
  const { toast } = useApp()
  const [reports] = useState<Report[]>(MOCK_REPORTS)

  const columns: DataTableColumn<Report>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (row) => <span className="font-mono text-[12px] font-bold text-[#64748B]">{row.id}</span>
    },
    {
      key: 'title',
      header: 'Report Title',
      sortable: true,
      render: (row) => <span className="font-bold text-[#0F172A]">{row.title}</span>
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => <span className="text-[13px] text-[#475569]">{row.type}</span>
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (row) => <span className="text-[13px] text-[#475569]">{row.date}</span>
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        row.status === 'Draft' ? (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-md text-[11px] font-bold uppercase tracking-wide w-max">
            <FileEdit className="w-3.5 h-3.5" /> Draft
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-bold uppercase tracking-wide w-max">
            <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
          </div>
        )
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'Draft' ? (
            <button onClick={() => toast({ type: 'info', title: 'Edit Draft', message: 'Opening draft editor...' })} className="h-8 px-3 rounded-[6px] bg-[#2563EB] text-white text-[12px] font-semibold hover:bg-[#1D4ED8] transition-colors">
              Continue
            </button>
          ) : (
            <button onClick={() => toast({ type: 'success', title: 'Download Started', message: 'PDF generated.' })} className="w-8 h-8 rounded-full border border-[#E2E8F0] text-[#64748B] flex items-center justify-center hover:bg-[#F8FAFC] hover:text-[#2563EB] transition-colors" title="Download PDF">
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <StaffLayout>
      <PageHeader 
        title="Reports & Logs" 
        subtitle="Manage your shift reports and incident logs."
        actions={
          <button onClick={() => toast({ type: 'info', title: 'New Report', message: 'Opening report template selector...' })} className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px] hover:bg-[#1D4ED8] transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Report
          </button>
        }
      />

      <WidgetCard title="My Reports" icon={FileText} iconColor="#475569" className="flex flex-col h-[calc(100vh-200px)] min-h-[600px]">
        <div className="flex-1 min-h-0">
          <DataTable 
            columns={columns}
            rows={reports}
            keyField={(row) => row.id}
            pageSize={10}
          />
        </div>
      </WidgetCard>
    </StaffLayout>
  )
}
