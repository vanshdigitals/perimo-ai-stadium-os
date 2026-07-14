import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { LifeBuoy, MessageCircle, BookOpen, Star, Search, Mail } from 'lucide-react';
import { PageHeader, StatusStrip, KPICard, WidgetCard, StatusPill, EmptyState } from '@/components/widgets';

interface Article {
  id: string;
  title: string;
  category: string;
  views: number;
}

const ARTICLES: Article[] = [
  { id: 'a1', title: 'How to approve an AI Copilot recommendation', category: 'AI Operations', views: 842 },
  { id: 'a2', title: 'Understanding Crowd Density thresholds', category: 'Crowd Intelligence', views: 631 },
  { id: 'a3', title: 'Setting up Notification Rules', category: 'Platform Settings', views: 528 },
  { id: 'a4', title: 'Assigning Roles & Permissions to new staff', category: 'Administration', views: 490 },
  { id: 'a5', title: 'Troubleshooting camera network dropouts', category: 'Security', views: 374 },
  { id: 'a6', title: 'Reading the Digital Twin layer controls', category: 'Digital Twin', views: 312 },
];

const CATEGORIES = ['All', 'AI Operations', 'Crowd Intelligence', 'Security', 'Administration', 'Digital Twin', 'Platform Settings'];

export const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = ARTICLES.filter(
    (a) => (category === 'All' || a.category === category) && (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <PageHeader title="Help Center" subtitle="Search articles, browse guides, or reach the support team directly." />

      <StatusStrip items={[{ label: 'Support Availability', value: '24/7' }, { label: 'Avg First Response', value: '6 min' }, { label: 'Articles', value: String(ARTICLES.length) }]} />

      <div className="grid grid-cols-12 gap-5 mb-5">
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Open Tickets" value="7" icon={MessageCircle} iconColor="#2563EB" delta={{ value: '2 awaiting reply', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Avg Response Time" value="6" unit="min" icon={LifeBuoy} iconColor="#1FAA6D" delta={{ value: 'Within SLA', direction: 'flat' }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Help Articles" value={String(ARTICLES.length)} icon={BookOpen} iconColor="#8B5CF6" delta={{ value: '3 added this month', direction: 'up', positive: true }} />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <KPICard label="Satisfaction Score" value="4.7" unit="/5" icon={Star} iconColor="#D68A00" delta={{ value: 'From 128 ratings', direction: 'flat' }} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 xl:col-span-8">
          <WidgetCard title="Browse Articles" icon={BookOpen} iconColor="#2563EB" className="min-h-[420px]">
            <div className="relative mb-4">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help articles..."
                className="w-full h-[40px] pl-9 pr-3 rounded-[8px] border border-[#E2E8F0] text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 h-[28px] rounded-[6px] text-[12px] font-medium transition-colors ${
                    category === c ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <EmptyState icon={BookOpen} message="No articles match your search." />
            ) : (
              <div className="flex flex-col divide-y divide-[#E2E8F0]">
                {filtered.map((a) => (
                  <div key={a.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 hover:bg-[#F8FAFC] -mx-2 px-2 rounded-[8px] cursor-pointer transition-colors">
                    <div>
                      <div className="text-[13px] font-medium text-[#0F172A]">{a.title}</div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">{a.category}</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#94A3B8] shrink-0">{a.views} views</span>
                  </div>
                ))}
              </div>
            )}
          </WidgetCard>
        </div>

        <div className="col-span-12 xl:col-span-4 flex flex-col gap-5">
          <WidgetCard title="Popular This Week" icon={Star} iconColor="#D68A00" className="min-h-[180px]">
            <div className="flex flex-col gap-2">
              {ARTICLES.slice(0, 3).map((a, i) => (
                <div key={a.id} className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[12px] font-bold text-[#94A3B8] w-4 shrink-0">{i + 1}</span>
                  <span className="text-[13px] font-medium text-[#334155] truncate">{a.title}</span>
                </div>
              ))}
            </div>
          </WidgetCard>

          <WidgetCard title="Contact Support" icon={Mail} iconColor="#2563EB" className="min-h-[200px]">
            <p className="text-[13px] text-[#64748B] leading-relaxed mb-4">Can&apos;t find what you&apos;re looking for? Our operations support team is available around the clock during live events.</p>
            <div className="flex items-center justify-between px-3 py-2.5 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] mb-3">
              <span className="text-[13px] font-medium text-[#334155]">Live Chat</span>
              <StatusPill label="Online" tone="success" dot />
            </div>
            <button className="w-full h-[36px] bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors">
              Start a Conversation
            </button>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
