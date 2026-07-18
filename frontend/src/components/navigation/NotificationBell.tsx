import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Check, Pin, X, Archive, ArchiveRestore, Search } from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { useApp } from '@/contexts/AppContext';
import type { AppNotification } from '@/contexts/AppContext';
import { t } from '@/i18n';
import { cn } from '@/utils/cn';

const ICONS = {
  critical: { icon: AlertTriangle, color: 'text-[#E5342B]', bg: 'bg-[#FEF2F2]' },
  warning:  { icon: AlertCircle,   color: 'text-[#D68A00]', bg: 'bg-[#FFFBEB]' },
  info:     { icon: Info,          color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
  resolved: { icon: CheckCircle2,  color: 'text-[#1FAA6D]', bg: 'bg-[#F0FDF4]' },
};

export const NotificationCenter: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('notifications');
  const { notifications, unreadCount, markRead, markAllRead, togglePin, archiveNotification, unarchiveNotification, deleteNotification, language } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Pinned' | 'Archived'>('All');
  const [search, setSearch] = useState('');

  const archivedCount = notifications.filter(n => n.archived).length;

  const displayed = notifications
    .filter(n => (activeTab === 'Archived' ? n.archived : !n.archived))
    .filter(n => {
      if (activeTab === 'Unread') return !n.read;
      if (activeTab === 'Pinned') return n.pinned;
      return true;
    })
    .filter(n =>
      !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.timestamp - a.timestamp);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={toggle}
        className={cn(
          'relative w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
          isOpen ? 'bg-[#F1F5F9] text-[#0F172A]' : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
        )}
        aria-expanded={isOpen}
        aria-label={`${t('notif.title', language)} (${unreadCount} unread)`}
      >
        <Bell className="w-[18px] h-[18px]" strokeWidth={2} />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-[5px] right-[5px] min-w-[14px] h-[14px] px-[3px] rounded-full bg-[#EF4444] ring-2 ring-white z-10 flex items-center justify-center tabular-nums">
              <span className="text-[8px] font-semibold text-white leading-none">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </span>
            <span className="absolute top-[5px] right-[5px] w-[14px] h-[14px] rounded-full bg-[#EF4444] opacity-60 motion-safe:animate-ping motion-reduce:hidden" style={{ animationDuration: '3s' }} aria-hidden="true" />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="absolute top-[44px] right-0 w-[400px] bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] flex flex-col z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden"
          role="dialog"
          aria-label={t('notif.title', language)}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
            <h3 className="font-semibold text-[#0F172A] text-[14px]">{t('notif.title', language)}</h3>
            <button
              onClick={markAllRead}
              className="text-[12px] font-medium text-[#2563EB] hover:text-[#1E3A8A] transition-colors"
            >
              {t('notif.markAllRead', language)}
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2 h-8 px-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none text-[12px] text-[#0F172A] focus:outline-none placeholder:text-[#94A3B8]"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-4 border-b border-[#E2E8F0] overflow-x-auto">
            {(['All', 'Unread', 'Pinned', 'Archived'] as const).map(tab => {
              const count = tab === 'Unread' ? unreadCount : tab === 'Archived' ? archivedCount : 0;
              const labels: Record<typeof tab, string> = {
                All: t('notif.all', language),
                Unread: t('notif.unread', language),
                Pinned: 'Pinned',
                Archived: 'Archived',
              };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-2 py-2.5 mr-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0',
                    activeTab === tab ? 'border-[#2563EB] text-[#0F172A]' : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                  )}
                >
                  {labels[tab]}
                  {(tab === 'Unread' || tab === 'Archived') && count > 0 && (
                    <span className="bg-[#E2E8F0] text-[#475569] text-[10px] px-1.5 rounded-full">{count}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto flex flex-col">
            {displayed.length === 0 ? (
              <div className="py-10 text-center">
                <Bell className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" />
                <p className="text-[13px] text-[#64748B]">{t('notif.empty', language)}</p>
              </div>
            ) : (
              displayed.map(n => <NotifItem key={n.id} n={n} language={language} onMarkRead={() => markRead(n.id)} onTogglePin={() => togglePin(n.id)} onArchive={() => archiveNotification(n.id)} onUnarchive={() => unarchiveNotification(n.id)} onDelete={() => deleteNotification(n.id)} />)
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const NotifItem: React.FC<{
  n: AppNotification;
  language: string;
  onMarkRead: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}> = ({ n, language, onMarkRead, onTogglePin, onArchive, onUnarchive, onDelete }) => {
  const cfg = ICONS[n.type];
  const Icon = cfg.icon;

  return (
    <div
      className={cn('p-4 border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors relative group', !n.read && 'bg-[#FAFBFF]')}
      onClick={() => !n.read && onMarkRead()}
    >
      {!n.read && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#2563EB] rounded-r" />}
      {n.pinned && <div className="absolute right-2 top-2"><Pin className="w-3 h-3 text-[#94A3B8]" /></div>}
      <div className="flex gap-3">
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', cfg.bg, cfg.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span className={cn('text-[13px] font-semibold truncate', !n.read ? 'text-[#0F172A]' : 'text-[#475569]')}>{n.title}</span>
            <span className="text-[11px] font-medium text-[#94A3B8] shrink-0 whitespace-nowrap">{n.time}</span>
          </div>
          <p className="text-[12px] text-[#64748B] leading-relaxed">{n.desc}</p>

          {/* Action row — always visible on mobile, hover on desktop */}
          <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!n.read && (
              <button
                onClick={e => { e.stopPropagation(); onMarkRead(); }}
                title={t('notif.markRead', language)}
                className="p-1 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#1FAA6D] hover:bg-[#F0FDF4] transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); onTogglePin(); }}
              title={t('notif.pin', language)}
              className={cn('p-1 rounded-[6px] bg-white border border-[#E2E8F0] transition-colors', n.pinned ? 'text-[#2563EB] bg-[#EFF6FF]' : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]')}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            {n.archived ? (
              <button
                onClick={e => { e.stopPropagation(); onUnarchive(); }}
                title="Restore"
                className="p-1 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
              >
                <ArchiveRestore className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={e => { e.stopPropagation(); onArchive(); }}
                title={t('notif.archive', language)}
                className="p-1 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={e => { e.stopPropagation(); onDelete(); }}
              className="p-1 rounded-[6px] bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#E5342B] hover:bg-[#FEF2F2] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
