import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { PageHeader, WidgetCard } from '@/components/widgets';
import { useApp } from '@/contexts/AppContext';
import type { Theme } from '@/contexts/AppContext';
import { LANGUAGE_META } from '@/i18n';
import { Monitor, Moon, Sun, Bell, Keyboard, Layout, Globe, Calendar, Clock, Save, Accessibility } from 'lucide-react';
import { cn } from '@/utils/cn';

const DASHBOARDS = ['Command Center', 'Live Operations', 'Crowd Intelligence', 'Analytics', 'Digital Twin'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const TIME_FORMATS = ['12h (AM/PM)', '24h'];

const SHORTCUTS = [
  { key: 'Ctrl + K', action: 'Open Command Palette' },
  { key: 'Ctrl + B', action: 'Toggle Sidebar' },
  { key: 'Ctrl + Shift + A', action: 'Broadcast Alert' },
  { key: 'Ctrl + Shift + I', action: 'Create Incident' },
  { key: 'Ctrl + Shift + L', action: 'Emergency Lockdown' },
  { key: 'Ctrl + /', action: 'Show All Shortcuts' },
];

const NOTIF_PREFS = [
  { id: 'critical', label: 'Critical Incidents', desc: 'Always receive critical alerts', checked: true, locked: true },
  { id: 'crowd', label: 'Crowd Density Alerts', desc: 'Gate and sector thresholds exceeded', checked: true, locked: false },
  { id: 'shift', label: 'Shift Change Reminders', desc: '30 minutes before shift change', checked: true, locked: false },
  { id: 'ai', label: 'AI Recommendations', desc: 'When Copilot generates suggestions', checked: false, locked: false },
  { id: 'digest', label: 'Weekly Digest', desc: 'Summary every Monday morning', checked: false, locked: false },
];

export const Preferences: React.FC = () => {
  const { theme, setTheme, language, setLanguage, toast } = useApp();
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [defaultDash, setDefaultDash] = useState('Command Center');
  const [notifPrefs, setNotifPrefs] = useState(NOTIF_PREFS);
  const [saving, setSaving] = useState(false);

  const toggleNotif = (id: string) => {
    setNotifPrefs(prev => prev.map(n => n.id === id && !n.locked ? { ...n, checked: !n.checked } : n));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ type: 'success', title: 'Preferences Saved', message: 'Your settings have been applied.' });
    }, 800);
  };

  const THEMES: { id: Theme; label: string; icon: React.ElementType }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Preferences"
        subtitle="Customize your PERIMO experience."
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px] hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Preferences
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-5">
        {/* Theme */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Theme" icon={Sun} iconColor="#D68A00">
            <div className="flex gap-3">
              {THEMES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setTheme(id); toast({ type: 'info', title: `Theme: ${label}`, message: 'Display preference updated.' }); }}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-2 py-4 rounded-[12px] border-2 transition-all',
                    theme === id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                  )}
                >
                  <Icon className={cn('w-5 h-5', theme === id ? 'text-[#2563EB]' : 'text-[#64748B]')} />
                  <span className={cn('text-[12px] font-semibold', theme === id ? 'text-[#1E40AF]' : 'text-[#475569]')}>{label}</span>
                </button>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Language */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Language" icon={Globe} iconColor="#2563EB">
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGE_META.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); toast({ type: 'info', title: `Language: ${lang.name}`, message: 'UI language updated immediately.' }); }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2.5 rounded-[10px] border-2 text-left transition-all',
                    language === lang.code ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white'
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-[13px] font-semibold', language === lang.code ? 'text-[#1E40AF]' : 'text-[#334155]')}>{lang.native}</div>
                    <div className="text-[11px] text-[#94A3B8]">{lang.name}</div>
                  </div>
                  {language === lang.code && <div className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />}
                </button>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Date & Time */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Date & Time Format" icon={Calendar} iconColor="#8B5CF6">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#344055] flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" /> Date Format
                </label>
                <div className="flex gap-2">
                  {DATE_FORMATS.map(f => (
                    <button key={f} onClick={() => setDateFormat(f)} className={cn('flex-1 h-9 rounded-[8px] border-2 text-[12px] font-mono transition-all', dateFormat === f ? 'border-[#8B5CF6] bg-[#F5F3FF] text-[#7C3AED]' : 'border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC] hover:bg-white')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#344055] flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8]" /> Time Format
                </label>
                <div className="flex gap-2">
                  {TIME_FORMATS.map(f => (
                    <button key={f} onClick={() => setTimeFormat(f)} className={cn('flex-1 h-9 rounded-[8px] border-2 text-[12px] font-medium transition-all', timeFormat === f ? 'border-[#8B5CF6] bg-[#F5F3FF] text-[#7C3AED]' : 'border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC] hover:bg-white')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Default Dashboard */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Default Dashboard" icon={Layout} iconColor="#1FAA6D">
            <div className="flex flex-col gap-1.5">
              {DASHBOARDS.map(d => (
                <button
                  key={d}
                  onClick={() => setDefaultDash(d)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-[10px] border-2 text-[13px] font-medium transition-all text-left',
                    defaultDash === d ? 'border-[#1FAA6D] bg-[#F0FDF4] text-[#14532D]' : 'border-transparent text-[#475569] hover:bg-[#F8FAFC]'
                  )}
                >
                  {d}
                  {defaultDash === d && <div className="w-2 h-2 rounded-full bg-[#1FAA6D]" />}
                </button>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Notifications */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Notification Preferences" icon={Bell} iconColor="#D68A00">
            <div className="flex flex-col gap-3">
              {notifPrefs.map(n => (
                <div key={n.id} className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A]">{n.label}</div>
                    <div className="text-[12px] text-[#64748B]">{n.desc}</div>
                  </div>
                  <button
                    onClick={() => toggleNotif(n.id)}
                    disabled={n.locked}
                    className={cn('relative w-10 h-6 rounded-full transition-colors shrink-0 disabled:opacity-60', n.checked ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]')}
                  >
                    <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all', n.checked ? 'left-5' : 'left-1')} />
                  </button>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Keyboard Shortcuts" icon={Keyboard} iconColor="#64748B">
            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {SHORTCUTS.map(s => (
                <div key={s.key} className="flex items-center justify-between py-2.5">
                  <span className="text-[13px] text-[#475569]">{s.action}</span>
                  <kbd className="font-mono text-[11px] font-semibold text-[#475569] bg-[#F1F5F9] border border-[#E2E8F0] rounded-[4px] px-2 py-0.5">{s.key}</kbd>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* Accessibility */}
        <div className="col-span-12">
          <WidgetCard title="Accessibility" icon={Accessibility} iconColor="#64748B">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Reduce Motion', desc: 'Minimize animations', id: 'reduce-motion' },
                { label: 'High Contrast', desc: 'Increase color contrast', id: 'high-contrast' },
                { label: 'Large Text', desc: 'Increase base font size', id: 'large-text' },
              ].map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                  <div>
                    <div className="text-[13px] font-semibold text-[#0F172A]">{a.label}</div>
                    <div className="text-[12px] text-[#64748B]">{a.desc}</div>
                  </div>
                  <div className="w-10 h-6 bg-[#E2E8F0] rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
