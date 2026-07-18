import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { HeaderActionButton } from '@/components/ui/HeaderActionButton';
import { TrendingUp, DollarSign, Users, Activity, Download } from 'lucide-react';
import { PageHeader, KPICard, WidgetCard, AreaLineChart, BarChart, DonutChart, DataTable } from '@/components/widgets';

const REVENUE_TREND = [1.8, 2.1, 2.4, 2.9, 3.4, 3.8, 4.1, 4.4, 4.6];
const ATTENDANCE_TREND = [68, 72, 75, 79, 82, 84, 88, 91, 98];

const GATE_PERFORMANCE = [
  { label: 'Gate A', value: 96 },
  { label: 'Gate B', value: 91 },
  { label: 'Gate C', value: 78, highlight: true },
  { label: 'Gate D', value: 94 },
];

interface MatchRow {
  id: string;
  match: string;
  date: string;
  attendance: string;
  revenue: string;
  incidents: number;
}

const HISTORY: MatchRow[] = [
  { id: 'm1', match: 'Real Madrid vs. Barcelona', date: 'Today', attendance: '81,414 (98%)', revenue: '$4.6M', incidents: 3 },
  { id: 'm2', match: 'Real Madrid vs. Atlético', date: 'Jun 28', attendance: '78,220 (94%)', revenue: '$4.1M', incidents: 1 },
  { id: 'm3', match: 'Real Madrid vs. Sevilla', date: 'Jun 21', attendance: '74,900 (90%)', revenue: '$3.8M', incidents: 2 },
  { id: 'm4', match: 'Real Madrid vs. Valencia', date: 'Jun 14', attendance: '69,500 (84%)', revenue: '$3.3M', incidents: 0 },
  { id: 'm5', match: 'Real Madrid vs. Villarreal', date: 'Jun 7', attendance: '71,200 (86%)', revenue: '$3.5M', incidents: 1 },
];

export const Analytics: React.FC = () => {
  const [range, setRange] = useState('7');

  return (
    <AdminLayout>
      <PageHeader
        title="Analytics"
        subtitle="Executive-level operational performance and historical trend analysis."
        actions={
          <>
            <select value={range} onChange={(e) => setRange(e.target.value)} className="h-[36px] rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] font-medium text-[#0F172A] px-3 outline-none">
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="1">Event Day Only</option>
            </select>
            <HeaderActionButton label="Export" icon={Download} toastTitle="Export started" toastMessage="Analytics report is being prepared for download." />
          </>
        }
      />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Attendance (Today)" value="81.4" unit="k" icon={Users} iconColor="#2563EB" delta={{ value: '98% of capacity', direction: 'flat' }} sparkline={ATTENDANCE_TREND} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Revenue (Today)" value="4.6" unit="$M" icon={DollarSign} iconColor="#1FAA6D" delta={{ value: '+12% vs last match', direction: 'up', positive: true }} sparkline={REVENUE_TREND} sparklineColor="#1FAA6D" />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Ops Efficiency Score" value="94" unit="/100" icon={Activity} iconColor="#8B5CF6" delta={{ value: '+2pt vs season avg', direction: 'up', positive: true }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Incidents / 10k Attendees" value="0.37" icon={TrendingUp} iconColor="#D68A00" delta={{ value: 'Below season average', direction: 'down', positive: true }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12">
          <WidgetCard title="Revenue vs. Attendance Correlation" icon={TrendingUp} iconColor="#2563EB" className="min-h-[320px]">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Revenue ($M)</div>
                <AreaLineChart data={REVENUE_TREND} labels={['Match -8', '', '', '', '', '', '', '', 'Today']} color="#1FAA6D" valueFormatter={(v) => `$${v}M`} />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">Attendance (%)</div>
                <AreaLineChart data={ATTENDANCE_TREND} labels={['Match -8', '', '', '', '', '', '', '', 'Today']} color="#2563EB" valueFormatter={(v) => `${v}%`} />
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Gate Performance (Throughput Score)" icon={Activity} iconColor="#8B5CF6" className="min-h-[280px]">
            <BarChart data={GATE_PERFORMANCE} maxValue={100} highlightColor="#C4291C" valueFormatter={(v) => `${v}/100`} />
          </WidgetCard>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <WidgetCard title="Incident Distribution (Season)" icon={TrendingUp} iconColor="#D68A00" className="min-h-[280px]">
            <DonutChart
              centerLabel="Total"
              centerValue="142"
              data={[
                { label: 'Medical', value: 48, color: '#C4291C' },
                { label: 'Crowd/Density', value: 39, color: '#D68A00' },
                { label: 'Facilities', value: 31, color: '#2563EB' },
                { label: 'Security', value: 24, color: '#8B5CF6' },
              ]}
            />
          </WidgetCard>
        </div>
      </div>

      <WidgetCard title="Historical Performance" icon={TrendingUp} iconColor="#64748B">
        <DataTable
          keyField={(r) => r.id}
          rows={HISTORY}
          columns={[
            { key: 'match', header: 'Match', render: (r) => <span className="font-medium text-[#0F172A]">{r.match}</span> },
            { key: 'date', header: 'Date', render: (r) => <span className="text-[#64748B]">{r.date}</span>, width: '100px' },
            { key: 'attendance', header: 'Attendance', render: (r) => <span className="font-mono text-[#64748B]">{r.attendance}</span>, width: '160px' },
            { key: 'revenue', header: 'Revenue', render: (r) => <span className="font-mono text-[#1FAA6D] font-medium">{r.revenue}</span>, width: '90px' },
            { key: 'incidents', header: 'Incidents', render: (r) => <span className="font-mono">{r.incidents}</span>, width: '80px', align: 'right' },
          ]}
        />
      </WidgetCard>
    </AdminLayout>
  );
};
