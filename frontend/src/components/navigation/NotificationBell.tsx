import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Check, Pin, PinOff,
  Archive, ArchiveRestore, Trash2, Search, SlidersHorizontal, MoreHorizontal,
  Settings, ArrowRight, CheckCheck,
} from 'lucide-react';
import { useOverlay } from '@/contexts/OverlayContext';
import { useApp } from '@/contexts/AppContext';
import type { AppNotification, NotifSeverity } from '@/contexts/AppContext';
import { t } from '@/i18n';
import { cn } from '@/utils/cn';

/** Priority visual language — colored accent + soft icon container. */
const PRIORITY: Record<NotifSeverity, { icon: React.ElementType; accent: string; fg: string; bg: string; label: string }> = {
  critical: { icon: AlertTriangle, accent: '#E5342B', fg: '#B91C1C', bg: '#FEF2F2', label: 'Critical' },
  warning:  { icon: AlertCircle,   accent: '#D68A00', fg: '#B45309', bg: '#FFFBEB', label: 'Warning' },
  info:     { icon: Info,          accent: '#2563EB', fg: '#1D4ED8', bg: '#EFF6FF', label: 'Info' },
  resolved: { icon: CheckCircle2,  accent: '#1FAA6D', fg: '#15803D', bg: '#F0FDF4', label: 'Resolved' },
};

type Tab = 'All' | 'Unread' | 'Pinned';
type PriorityFilter = 'all' | NotifSeverity;

export const NotificationCenter: React.FC = () => {
  const { isOpen, toggle, containerRef } = useOverlay('notifications');
  const {
    notifications, unreadCount, markRead, markAllRead, togglePin,
    archiveNotification, unarchiveNotification, deleteNotification, language,
  } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const pinnedCount = notifications.filter(n => n.pinned && !n.archived).length;

  const displayed = notifications
    .filter(n => (showArchived ? true : !n.archived))
    .filter(n => {
      if (activeTab === 'Unread') return !n.read;
      if (activeTab === 'Pinned') return n.pinned;
      return true;
    })
    .filter(n => priorityFilter === 'all' || n.type === priorityFilter)
    .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.timestamp - a.timestamp);

  const closeMenus = () => { setShowFilter(false); setMenuOpenId(null); };

  const goTo = (path: string) => { closeMenus(); toggle(); navigate(path); };

  const filterActive = priorityFilter !== 'all' || showArchived;

  const TABS: { id: Tab; label: string; badge?: number }[] = [
    { id: 'All', label: t('notif.all', language) },
    { id: 'Unread', label: t('notif.unread', language), badge: unreadCount },
    { id: 'Pinned', label: 'Pinned', badge: pinnedCount },
  ];

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
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

      {/* Panel */}
      {isOpen && (
        <div
          className="absolute top-[46px] right-0 w-[400px] bg-white border border-[#E8ECF1] rounded-[16px] shadow-[0_16px_48px_-8px_rgba(11,14,20,0.20),0_0_0_1px_rgba(11,14,20,0.02)] flex flex-col z-[150] animate-in fade-in zoom-in-95 duration-150 origin-top-right overflow-hidden"
          role="dialog"
          aria-label={t('notif.title', language)}
        >
          {/* Header */}
          <div className="px-4 pt-4 pb-3 flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-[#0F172A] text-[15px] tracking-[-0.01em] leading-none">{t('notif.title', language)}</h3>
              <p className="text-[12px] text-[#64748B] mt-1 leading-none">
                {unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'}
              </p>
            </div>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 text-[12px] font-medium text-[#2563EB] hover:text-[#1E3A8A] disabled:text-[#CBD5E1] disabled:cursor-default transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" strokeWidth={2} />
              {t('notif.markAllRead', language)}
            </button>
          </div>

          {/* Search + filter */}
          <div className="px-4 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 h-9 px-3 bg-[#F6F8FA] border border-[#E8ECF1] rounded-[10px] focus-within:border-[#2563EB] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#2563EB]/12 transition-all">
              <Search className="w-4 h-4 text-[#94A3B8] shrink-0" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search notifications"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none text-[13px] text-[#0F172A] focus:outline-none placeholder:text-[#94A3B8]"
              />
            </div>
            <div className="relative shrink-0">
              <button
                onClick={() => { setMenuOpenId(null); setShowFilter(v => !v); }}
                aria-label="Filter"
                aria-expanded={showFilter}
                className={cn(
                  'w-9 h-9 rounded-[10px] border flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                  filterActive || showFilter
                    ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#2563EB]'
                    : 'bg-white border-[#E8ECF1] text-[#64748B] hover:bg-[#F6F8FA] hover:text-[#0F172A]'
                )}
              >
                <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
                {filterActive && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#2563EB] ring-2 ring-white" />}
              </button>

              {showFilter && (
                <FilterMenu
                  priorityFilter={priorityFilter}
                  setPriorityFilter={setPriorityFilter}
                  showArchived={showArchived}
                  setShowArchived={setShowArchived}
                  onClear={() => { setPriorityFilter('all'); setShowArchived(false); }}
                />
              )}
            </div>
          </div>

          {/* Segmented control */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-1 p-1 bg-[#F1F4F8] rounded-[10px]" role="tablist">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 h-7 rounded-[7px] text-[12px] font-medium flex items-center justify-center gap-1.5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                    activeTab === tab.id
                      ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(11,14,20,0.10)]'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  )}
                >
                  {tab.label}
                  {tab.badge ? (
                    <span className={cn(
                      'min-w-[16px] h-4 px-1 rounded-full text-[10px] font-semibold flex items-center justify-center tabular-nums',
                      activeTab === tab.id ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#E2E8F0] text-[#64748B]'
                    )}>{tab.badge}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="max-h-[368px] overflow-y-auto px-2 pb-2 flex flex-col gap-0.5">
            {displayed.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-11 h-11 rounded-[12px] bg-[#F1F4F8] flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-5 h-5 text-[#94A3B8]" strokeWidth={1.75} />
                </div>
                <p className="text-[13px] font-medium text-[#334155]">{t('notif.empty', language)}</p>
                <p className="text-[12px] text-[#94A3B8] mt-0.5">New alerts will appear here in real time.</p>
              </div>
            ) : (
              displayed.map(n => (
                <NotifCard
                  key={n.id}
                  n={n}
                  language={language}
                  menuOpen={menuOpenId === n.id}
                  onToggleMenu={() => setMenuOpenId(id => (id === n.id ? null : n.id))}
                  onCloseMenu={() => setMenuOpenId(null)}
                  onMarkRead={() => markRead(n.id)}
                  onTogglePin={() => togglePin(n.id)}
                  onArchive={() => archiveNotification(n.id)}
                  onUnarchive={() => unarchiveNotification(n.id)}
                  onDelete={() => deleteNotification(n.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#E8ECF1] p-2 flex items-center gap-1 bg-[#FAFBFC]">
            <button
              onClick={() => goTo('/admin/notifications')}
              className="flex-1 h-9 rounded-[9px] text-[12.5px] font-semibold text-[#2563EB] hover:bg-[#EFF6FF] transition-colors flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              View All Notifications
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.25} />
            </button>
            <button
              onClick={() => goTo('/admin/settings')}
              aria-label="Notification Settings"
              className="h-9 px-3 rounded-[9px] text-[12.5px] font-medium text-[#64748B] hover:bg-white hover:text-[#0F172A] hover:shadow-[0_1px_2px_rgba(11,14,20,0.08)] transition-all flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            >
              <Settings className="w-3.5 h-3.5" strokeWidth={2} />
              Settings
            </button>
          </div>

          {/* Click-catcher to dismiss open in-panel menus */}
          {(showFilter || menuOpenId) && (
            <button
              aria-hidden="true"
              tabIndex={-1}
              className="absolute inset-0 z-[20] cursor-default"
              onClick={closeMenus}
            />
          )}
        </div>
      )}
    </div>
  );
};

// ── Filter menu ───────────────────────────────────────────────────────────────

const FilterMenu: React.FC<{
  priorityFilter: PriorityFilter;
  setPriorityFilter: (p: PriorityFilter) => void;
  showArchived: boolean;
  setShowArchived: (v: boolean) => void;
  onClear: () => void;
}> = ({ priorityFilter, setPriorityFilter, showArchived, setShowArchived, onClear }) => {
  const options: PriorityFilter[] = ['all', 'critical', 'warning', 'info', 'resolved'];
  return (
    <div className="absolute top-[42px] right-0 w-[184px] bg-white border border-[#E8ECF1] rounded-[12px] shadow-[0_12px_32px_rgba(11,14,20,0.16)] p-1.5 z-[30] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
      <div className="px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Priority</div>
      {options.map(opt => {
        const label = opt === 'all' ? 'All priorities' : PRIORITY[opt].label;
        const active = priorityFilter === opt;
        return (
          <button
            key={opt}
            onClick={() => setPriorityFilter(opt)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors',
              active ? 'bg-[#F1F4F8] text-[#0F172A]' : 'text-[#475569] hover:bg-[#F6F8FA]'
            )}
          >
            {opt !== 'all' && <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PRIORITY[opt].accent }} />}
            {opt === 'all' && <span className="w-2 h-2 rounded-full shrink-0 bg-[#94A3B8]" />}
            <span className="flex-1 text-left">{label}</span>
            {active && <Check className="w-3.5 h-3.5 text-[#2563EB]" strokeWidth={2.5} />}
          </button>
        );
      })}
      <div className="h-px bg-[#E8ECF1] my-1.5" />
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[8px] text-[12.5px] font-medium text-[#475569] hover:bg-[#F6F8FA] transition-colors"
      >
        <Archive className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={2} />
        <span className="flex-1 text-left">Show archived</span>
        <span className={cn('w-8 h-[18px] rounded-full p-0.5 transition-colors flex', showArchived ? 'bg-[#2563EB] justify-end' : 'bg-[#CBD5E1] justify-start')}>
          <span className="w-[14px] h-[14px] rounded-full bg-white shadow-sm" />
        </span>
      </button>
      <button onClick={onClear} className="w-full mt-0.5 px-2 py-1.5 rounded-[8px] text-[12px] font-medium text-[#94A3B8] hover:bg-[#F6F8FA] hover:text-[#64748B] transition-colors text-left">
        Clear filters
      </button>
    </div>
  );
};

// ── Notification card ─────────────────────────────────────────────────────────

const NotifCard: React.FC<{
  n: AppNotification;
  language: string;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onMarkRead: () => void;
  onTogglePin: () => void;
  onArchive: () => void;
  onUnarchive: () => void;
  onDelete: () => void;
}> = ({ n, language, menuOpen, onToggleMenu, onCloseMenu, onMarkRead, onTogglePin, onArchive, onUnarchive, onDelete }) => {
  const p = PRIORITY[n.type];
  const Icon = p.icon;

  const act = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); onCloseMenu(); fn(); };

  return (
    <div
      onClick={() => { if (menuOpen) { onCloseMenu(); return; } if (!n.read) onMarkRead(); }}
      className={cn(
        'group relative rounded-[11px] pl-3.5 pr-2 py-2.5 cursor-pointer transition-all duration-150 border border-transparent',
        n.read
          ? 'hover:bg-[#F8FAFC] hover:border-[#E8ECF1] hover:shadow-[0_2px_10px_-4px_rgba(11,14,20,0.12)]'
          : 'bg-[#F7FAFF] hover:bg-[#EFF6FF]/70 hover:border-[#BFDBFE] hover:shadow-[0_2px_12px_-4px_rgba(37,99,235,0.22)]'
      )}
    >
      {/* 4px priority accent bar */}
      <span className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full" style={{ backgroundColor: p.accent }} aria-hidden="true" />

      <div className="flex gap-2.5 pl-1.5">
        {/* Soft icon container */}
        <div className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: p.bg }}>
          <Icon className="w-[15px] h-[15px]" style={{ color: p.fg }} strokeWidth={2.25} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row: unread dot + title + timestamp + overflow */}
          <div className="flex items-center gap-1.5">
            {!n.read && <span className="w-[6px] h-[6px] rounded-full bg-[#2563EB] shrink-0" aria-hidden="true" />}
            <span className={cn('text-[13px] truncate leading-tight', n.read ? 'font-medium text-[#334155]' : 'font-semibold text-[#0F172A]')}>
              {n.title}
            </span>
            {n.pinned && <Pin className="w-3 h-3 text-[#94A3B8] shrink-0 -rotate-45 fill-[#94A3B8]" aria-label="Pinned" />}
            <span className="ml-auto text-[11px] font-medium text-[#94A3B8] shrink-0 whitespace-nowrap tabular-nums group-hover:opacity-0 transition-opacity">
              {n.time}
            </span>
            {/* Overflow trigger (appears on hover, replaces timestamp slot) */}
            <button
              onClick={e => { e.stopPropagation(); onToggleMenu(); }}
              aria-label="More actions"
              aria-expanded={menuOpen}
              className={cn(
                'absolute right-2 top-2.5 w-6 h-6 rounded-[7px] flex items-center justify-center transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]',
                menuOpen ? 'opacity-100 bg-[#F1F4F8] text-[#0F172A]' : 'opacity-0 group-hover:opacity-100 text-[#64748B] hover:bg-[#F1F4F8] hover:text-[#0F172A]'
              )}
            >
              <MoreHorizontal className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          <p className="text-[12px] text-[#64748B] leading-snug line-clamp-1 mt-0.5">{n.desc}</p>
        </div>
      </div>

      {/* Overflow menu */}
      {menuOpen && (
        <div className="absolute right-2 top-9 w-[168px] bg-white border border-[#E8ECF1] rounded-[11px] shadow-[0_12px_32px_rgba(11,14,20,0.18)] p-1.5 z-[30] animate-in fade-in zoom-in-95 duration-100 origin-top-right">
          {!n.read && (
            <MenuItem icon={Check} label={t('notif.markRead', language)} onClick={act(onMarkRead)} />
          )}
          <MenuItem
            icon={n.pinned ? PinOff : Pin}
            label={n.pinned ? 'Unpin' : t('notif.pin', language)}
            onClick={act(onTogglePin)}
          />
          {n.archived ? (
            <MenuItem icon={ArchiveRestore} label="Restore" onClick={act(onUnarchive)} />
          ) : (
            <MenuItem icon={Archive} label={t('notif.archive', language)} onClick={act(onArchive)} />
          )}
          <div className="h-px bg-[#E8ECF1] my-1" />
          <MenuItem icon={Trash2} label="Delete" destructive onClick={act(onDelete)} />
        </div>
      )}
    </div>
  );
};

const MenuItem: React.FC<{ icon: React.ElementType; label: string; onClick: (e: React.MouseEvent) => void; destructive?: boolean }> = ({ icon: Icon, label, onClick, destructive }) => (
  <button
    onClick={onClick}
    className={cn(
      'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors outline-none',
      destructive
        ? 'text-[#E5342B] hover:bg-[#FEF2F2] focus-visible:bg-[#FEF2F2]'
        : 'text-[#475569] hover:bg-[#F6F8FA] focus-visible:bg-[#F6F8FA]'
    )}
  >
    <Icon className={cn('w-3.5 h-3.5', destructive ? 'text-[#E5342B]' : 'text-[#64748B]')} strokeWidth={2} />
    {label}
  </button>
);
