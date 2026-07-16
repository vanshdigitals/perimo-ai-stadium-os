import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { PageHeader, WidgetCard } from '@/components/widgets';
import { useApp } from '@/contexts/AppContext';
import { Camera, Save, X, Clock, Globe, Briefcase, Phone, User, Mail, Edit3 } from 'lucide-react';
import { cn } from '@/utils/cn';

const ACTIVITY = [
  { action: 'Logged in via MFA', detail: 'Chrome on Windows · IP 192.168.1.100', time: '2 min ago', icon: '🔐' },
  { action: 'Deployed Security Alpha', detail: 'Gate C — Emergency response', time: '18 min ago', icon: '👥' },
  { action: 'Broadcast Alert sent', detail: 'High Density warning to all staff', time: '1h ago', icon: '📡' },
  { action: 'Exported Audit Logs', detail: 'CSV — 126 records', time: '3h ago', icon: '📊' },
  { action: 'Updated Platform Settings', detail: 'Maintenance window configured', time: 'Yesterday', icon: '⚙️' },
];

const TIMEZONES = [
  'Asia/Kolkata', 'UTC', 'America/New_York', 'America/Los_Angeles',
  'Europe/London', 'Europe/Madrid', 'Australia/Sydney',
];

const inputCls = 'h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all w-full bg-white';

export const MyProfile: React.FC = () => {
  const { user, updateUser, toast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });
  const [saving, setSaving] = useState(false);

  const handleEdit = () => { setForm({ ...user }); setEditing(true); };
  const handleCancel = () => setEditing(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      updateUser(form);
      setSaving(false);
      setEditing(false);
      toast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been saved.' });
    }, 800);
  };

  const Field = ({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-semibold text-[#344055] flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-[#94A3B8]" /> {label}
      </label>
      {children}
    </div>
  );

  return (
    <AdminLayout>
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information, avatar and preferences."
        actions={
          !editing ? (
            <button
              onClick={handleEdit}
              className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Profile
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors flex items-center gap-2">
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-[36px] px-4 rounded-[8px] bg-[#2563EB] text-white font-medium text-[13px] hover:bg-[#1D4ED8] transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-12 gap-5">
        {/* Avatar + Identity */}
        <div className="col-span-12 lg:col-span-4">
          <WidgetCard title="Identity" icon={User} iconColor="#2563EB">
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-[16px] bg-gradient-to-br from-[#2563EB] to-[#1E3A8A] text-white flex items-center justify-center text-[28px] font-bold shadow-lg">
                  {user.initials}
                </div>
                {editing && (
                  <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-[#E2E8F0] shadow flex items-center justify-center hover:bg-[#F1F5F9] transition-colors">
                    <Camera className="w-3.5 h-3.5 text-[#64748B]" />
                  </button>
                )}
              </div>
              <div className="text-center">
                <div className="text-[16px] font-bold text-[#0F172A]">{user.displayName}</div>
                <div className="text-[13px] text-[#64748B]">{user.email}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full">
                  {user.role}
                </div>
              </div>
              <div className="w-full border-t border-[#E2E8F0] pt-3 flex flex-col gap-2 text-[13px]">
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Briefcase className="w-3.5 h-3.5 shrink-0" /> {user.organization}
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Clock className="w-3.5 h-3.5 shrink-0" /> {user.timezone}
                </div>
                <div className="flex items-center gap-2 text-[#64748B]">
                  <Globe className="w-3.5 h-3.5 shrink-0" /> {user.language.toUpperCase()}
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Edit Form */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
          <WidgetCard title="Profile Information" icon={Edit3} iconColor="#2563EB">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" icon={User}>
                {editing ? (
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, displayName: e.target.value }))} className={inputCls} />
                ) : (
                  <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.name}</div>
                )}
              </Field>
              <Field label="Email" icon={Mail}>
                {editing ? (
                  <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputCls} type="email" />
                ) : (
                  <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.email}</div>
                )}
              </Field>
              <Field label="Phone" icon={Phone}>
                {editing ? (
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputCls} type="tel" />
                ) : (
                  <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.phone || '—'}</div>
                )}
              </Field>
              <Field label="Organization" icon={Briefcase}>
                {editing ? (
                  <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className={inputCls} />
                ) : (
                  <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.organization}</div>
                )}
              </Field>
              <Field label="Timezone" icon={Clock}>
                {editing ? (
                  <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))} className={cn(inputCls, 'cursor-pointer')}>
                    {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
                  </select>
                ) : (
                  <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.timezone}</div>
                )}
              </Field>
              <Field label="Role" icon={Briefcase}>
                <div className="h-[40px] px-3 flex items-center text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent">{user.role}</div>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Bio" icon={Edit3}>
                  {editing ? (
                    <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="rounded-[8px] border border-[#E2E8F0] px-3 py-2.5 text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all w-full resize-none" />
                  ) : (
                    <div className="px-3 py-2.5 text-[13px] text-[#334155] bg-[#F8FAFC] rounded-[8px] border border-transparent min-h-[60px]">{user.bio || '—'}</div>
                  )}
                </Field>
              </div>
            </div>
          </WidgetCard>

          <WidgetCard title="Activity History" icon={Clock} iconColor="#64748B">
            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <span className="text-[16px] shrink-0 mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A]">{a.action}</div>
                    <div className="text-[12px] text-[#64748B]">{a.detail}</div>
                  </div>
                  <span className="text-[11px] text-[#94A3B8] whitespace-nowrap shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>
      </div>
    </AdminLayout>
  );
};
