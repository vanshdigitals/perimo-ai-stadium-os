import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { BookOpen, Code2, GitBranch, FileText, Layers } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, Timeline, StatusPill } from '@/components/widgets';
import type { TimelineEvent } from '@/components/widgets';

const SECTIONS = [
  { label: 'Getting Started', icon: BookOpen, count: 8 },
  { label: 'API Reference', icon: Code2, count: 24 },
  { label: 'System Architecture', icon: Layers, count: 6 },
  { label: 'Integration Guides', icon: GitBranch, count: 11 },
];

const CHANGELOG: TimelineEvent[] = [
  { id: 'ch1', time: 'v2.4.0', title: 'AI Operations Copilot — Primary/Backup failover', description: 'Automatic key failover with exponential backoff for Gemini API calls.', tone: 'success' },
  { id: 'ch2', time: 'v2.3.2', title: 'Command Center Bento Grid redesign', description: 'Reworked layout hierarchy, aspect-ratio-locked Digital Twin.', tone: 'info' },
  { id: 'ch3', time: 'v2.3.0', title: 'Enterprise header redesign', description: 'Command palette, notification center, role switcher.', tone: 'info' },
  { id: 'ch4', time: 'v2.2.1', title: 'WCAG AA contrast fixes', description: 'Status colors adjusted across all modules for accessibility compliance.', tone: 'success' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/stadium', desc: 'Zone/facility metadata & enum vocabularies' },
  { method: 'POST', path: '/api/assist', desc: 'Wayfinding assistant (rate-limited)' },
  { method: 'GET', path: '/api/health', desc: 'Service health check' },
];

const METHOD_TONE: Record<string, 'success' | 'info'> = { GET: 'info', POST: 'success' };

export const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <AdminLayout>
      <PageHeader title="Documentation" subtitle="System architecture, API reference, and integration guides." />

      <StatusStrip items={[{ label: 'API Version', value: 'v2.4.0' }, { label: 'Docs Last Updated', value: '2 days ago' }, { label: 'Total Pages', value: '49' }]} />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Documentation Pages" value="49" icon={FileText} iconColor="#2563EB" delta={{ value: '4 sections', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="API Version" value="2.4.0" icon={Code2} iconColor="#8B5CF6" delta={{ value: 'Released this week', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="API Endpoints" value="3" icon={GitBranch} iconColor="#1FAA6D" delta={{ value: 'All operational', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Last Updated" value="2" unit="days ago" icon={BookOpen} iconColor="#D68A00" delta={{ value: 'Changelog v2.4.0', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-2">
          {SECTIONS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActiveSection(i)}
              className={`text-left p-4 border rounded-[12px] transition-colors flex items-center justify-between cursor-pointer ${
                activeSection === i ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <s.icon className={`w-4 h-4 ${activeSection === i ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`} />
                <span className={`font-medium text-[13px] ${activeSection === i ? 'text-[#1E40AF]' : 'text-[#0F172A]'}`}>{s.label}</span>
              </span>
              <span className="text-[11px] font-mono text-[#94A3B8]">{s.count} pages</span>
            </button>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-8">
          <WidgetCard title="API Reference" icon={Code2} iconColor="#8B5CF6" className="min-h-[280px]">
            <div className="flex flex-col gap-2">
              {API_ENDPOINTS.map((e) => (
                <div key={e.path} className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <StatusPill label={e.method} tone={METHOD_TONE[e.method]} />
                  <span className="font-mono text-[13px] text-[#0F172A]">{e.path}</span>
                  <span className="text-[12px] text-[#64748B] ml-auto text-right">{e.desc}</span>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>

      <WidgetCard title="Changelog" icon={GitBranch} iconColor="#64748B">
        <Timeline events={CHANGELOG} />
      </WidgetCard>
    </AdminLayout>
  );
};
