import React, { useState } from 'react';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { PageHeader, WidgetCard, StatusPill } from '@/components/widgets';
import { useApp } from '@/contexts/AppContext';
import { ConfirmDialog } from '@/components/ui/Modal';
import { Key, Shield, Smartphone, Lock, RefreshCw, Plus, Trash2, Eye, EyeOff, Copy, CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const SESSIONS = [
  { id: 's1', device: 'Chrome on Windows 11', ip: '192.168.1.100', location: 'Mumbai, IN', lastActive: 'Active now', current: true },
  { id: 's2', device: 'Safari on iPhone 15', ip: '10.0.0.55', location: 'Delhi, IN', lastActive: '2h ago', current: false },
  { id: 's3', device: 'Firefox on macOS', ip: '172.16.0.10', location: 'Bangalore, IN', lastActive: '1d ago', current: false },
];

const RECOVERY_CODES = [
  'XKMT-2948-NVQR', 'BPLF-7731-QDMW', 'YRSC-4489-TKVN',
  'JGWZ-8812-PNAB', 'CMFD-3357-LRXT', 'OHQK-6624-YWVE',
  'AZTM-9915-SFBP', 'UVND-1183-CJOG',
];

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  scope: string;
}

const INITIAL_KEYS: ApiKey[] = [
  { id: 'k1', name: 'Production Dashboard', key: 'pk_live_xX7mQ2nK8vBpR4dL', created: '2026-01-15', lastUsed: '2 min ago', scope: 'Read / Write' },
  { id: 'k2', name: 'Monitoring Integration', key: 'pk_live_aTw9cF3jYsNqG6eM', created: '2026-03-22', lastUsed: '1h ago', scope: 'Read only' },
];

const inputCls = 'h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all w-full';

export const SecuritySettings: React.FC = () => {
  const { toast } = useApp();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [showRecovery, setShowRecovery] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [confirmRevokeAll, setConfirmRevokeAll] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Read only');
  const [newKeyResult, setNewKeyResult] = useState<string | null>(null);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    setConfirmRevoke(null);
    toast({ type: 'success', title: 'API Key Revoked', message: 'The key has been permanently invalidated.' });
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const key = `pk_live_${Math.random().toString(36).slice(2, 18)}`;
    const newKey: ApiKey = {
      id: `k-${Date.now()}`,
      name: newKeyName,
      key,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      scope: newKeyScope,
    };
    setApiKeys(prev => [...prev, newKey]);
    setNewKeyResult(key);
    setNewKeyName('');
    toast({ type: 'success', title: 'API Key Created', message: 'Copy and store it securely — it won\'t be shown again.' });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast({ type: 'info', title: 'Copied to clipboard' });
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || newPw !== confirmPw) {
      toast({ type: 'error', title: 'Password Mismatch', message: 'New passwords do not match.' });
      return;
    }
    setChangingPw(true);
    setTimeout(() => {
      setChangingPw(false);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      toast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed successfully.' });
    }, 1000);
  };

  const handleRevokeSession = (id: string) => {
    toast({ type: 'success', title: 'Session Revoked', message: `Device session ${id} has been signed out.` });
  };

  return (
    <AdminLayout>
      <PageHeader title="Security & API Keys" subtitle="Manage authentication, active sessions, and API access." />

      <div className="grid grid-cols-12 gap-5">
        {/* Password */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Change Password" icon={Lock} iconColor="#2563EB">
            <div className="flex flex-col gap-4">
              {[
                { label: 'Current Password', value: currentPw, setter: setCurrentPw },
                { label: 'New Password', value: newPw, setter: setNewPw },
                { label: 'Confirm New Password', value: confirmPw, setter: setConfirmPw },
              ].map(f => (
                <div key={f.label} className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-[#344055]">{f.label}</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={f.value}
                      onChange={e => f.setter(e.target.value)}
                      className={cn(inputCls, 'pr-10')}
                    />
                    <button onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569]">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={handleChangePassword}
                disabled={changingPw}
                className="h-9 px-4 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors disabled:opacity-60 flex items-center gap-2 self-start"
              >
                {changingPw && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Update Password
              </button>
            </div>
          </WidgetCard>
        </div>

        {/* 2FA */}
        <div className="col-span-12 md:col-span-6">
          <WidgetCard title="Two-Factor Authentication" icon={Smartphone} iconColor="#1FAA6D">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                <div>
                  <div className="text-[14px] font-semibold text-[#0F172A]">Authenticator App</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">TOTP via Google Authenticator</div>
                </div>
                <button
                  onClick={() => { setTwoFAEnabled(p => !p); toast({ type: twoFAEnabled ? 'warning' : 'success', title: twoFAEnabled ? '2FA Disabled' : '2FA Enabled' }); }}
                  className={cn('relative w-12 h-6 rounded-full transition-colors', twoFAEnabled ? 'bg-[#1FAA6D]' : 'bg-[#E2E8F0]')}
                >
                  <div className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all', twoFAEnabled ? 'left-7' : 'left-1')} />
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#344055]">Recovery Codes</span>
                  <button onClick={() => setShowRecovery(p => !p)} className="text-[12px] font-medium text-[#2563EB] hover:text-[#1E3A8A]">
                    {showRecovery ? 'Hide' : 'View'} Codes
                  </button>
                </div>
                {showRecovery && (
                  <div className="grid grid-cols-2 gap-1.5 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
                    {RECOVERY_CODES.map(code => (
                      <code key={code} className="text-[11px] font-mono text-[#334155] bg-white border border-[#E2E8F0] px-2 py-1 rounded">{code}</code>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Sessions */}
        <div className="col-span-12">
          <WidgetCard title="Active Sessions" icon={Shield} iconColor="#8B5CF6"
            actions={
              <button onClick={() => { setConfirmRevokeAll(true); }} className="text-[12px] font-medium text-[#E5342B] hover:text-[#C4291C]">
                Revoke all others
              </button>
            }
          >
            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {SESSIONS.map(s => (
                <div key={s.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <Smartphone className="w-4.5 h-4.5 text-[#64748B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#0F172A]">{s.device}</span>
                      {s.current && <StatusPill label="Current" tone="success" />}
                    </div>
                    <div className="text-[12px] text-[#64748B]">{s.ip} · {s.location} · {s.lastActive}</div>
                  </div>
                  {!s.current && (
                    <button onClick={() => handleRevokeSession(s.id)} className="text-[12px] font-medium text-[#E5342B] hover:text-[#C4291C] whitespace-nowrap">
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </WidgetCard>
        </div>

        {/* API Keys */}
        <div className="col-span-12">
          <WidgetCard title="API Keys" icon={Key} iconColor="#D68A00"
            actions={
              <button
                onClick={() => setShowCreateKey(p => !p)}
                className="h-[32px] px-3 rounded-[8px] bg-[#2563EB] text-white text-[12px] font-medium hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Key
              </button>
            }
          >
            {showCreateKey && (
              <div className="mb-4 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] flex flex-col gap-3">
                {newKeyResult ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] font-semibold text-[#1FAA6D] flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> API Key Created</p>
                    <p className="text-[12px] text-[#64748B]">Copy this key now — it won't be shown again.</p>
                    <div className="flex items-center gap-2 p-2.5 bg-white border border-[#E2E8F0] rounded-[8px] font-mono text-[12px] text-[#334155]">
                      <span className="flex-1 truncate">{newKeyResult}</span>
                      <button onClick={() => handleCopy(newKeyResult, 'new')} className="shrink-0 text-[#2563EB] hover:text-[#1E3A8A]">
                        {copied === 'new' ? <CheckCircle2 className="w-4 h-4 text-[#1FAA6D]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <button onClick={() => { setShowCreateKey(false); setNewKeyResult(null); }} className="text-[12px] font-medium text-[#64748B] self-start">Done</button>
                  </div>
                ) : (
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <label className="text-[13px] font-semibold text-[#344055] block mb-1.5">Key Name</label>
                      <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)} className={inputCls} placeholder="e.g. CI/CD Pipeline" />
                    </div>
                    <div>
                      <label className="text-[13px] font-semibold text-[#344055] block mb-1.5">Scope</label>
                      <select value={newKeyScope} onChange={e => setNewKeyScope(e.target.value)} className={cn(inputCls, 'cursor-pointer w-32')}>
                        <option>Read only</option>
                        <option>Read / Write</option>
                        <option>Admin</option>
                      </select>
                    </div>
                    <button onClick={handleCreateKey} disabled={!newKeyName.trim()} className="h-10 px-4 bg-[#2563EB] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#1D4ED8] disabled:opacity-60 whitespace-nowrap">
                      Generate
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col divide-y divide-[#E2E8F0]">
              {apiKeys.map(k => (
                <div key={k.id} className="flex items-center gap-3 py-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4 text-[#D68A00]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A]">{k.name}</div>
                    <div className="text-[12px] text-[#64748B] font-mono">{k.key.slice(0, 20)}••••</div>
                    <div className="text-[11px] text-[#94A3B8]">Created {k.created} · Last used {k.lastUsed} · {k.scope}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopy(k.key, k.id)} className="p-1.5 rounded-[6px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors" title="Copy key">
                      {copied === k.id ? <CheckCircle2 className="w-4 h-4 text-[#1FAA6D]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => toast({ type: 'info', title: 'Key Rotated', message: 'A new key has been generated.' })} className="p-1.5 rounded-[6px] text-[#64748B] hover:bg-[#F1F5F9] transition-colors" title="Rotate key">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmRevoke(k.id)} className="p-1.5 rounded-[6px] text-[#E5342B] hover:bg-[#FEF2F2] transition-colors" title="Revoke key">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {apiKeys.length === 0 && (
                <div className="py-8 text-center text-[13px] text-[#94A3B8]">No API keys. Create one above.</div>
              )}
            </div>
          </WidgetCard>
        </div>
      </div>

      <ConfirmDialog
        open={confirmRevoke !== null}
        onClose={() => setConfirmRevoke(null)}
        onConfirm={() => handleRevokeKey(confirmRevoke!)}
        title="Revoke API Key"
        message="This key will be immediately invalidated. Any integrations using it will stop working. This cannot be undone."
        confirmLabel="Revoke Key"
        destructive
      />
      <ConfirmDialog
        open={confirmRevokeAll}
        onClose={() => setConfirmRevokeAll(false)}
        onConfirm={() => { setConfirmRevokeAll(false); toast({ type: 'success', title: 'Other Sessions Revoked', message: 'All other devices signed out.' }); }}
        title="Revoke All Other Sessions"
        message="All devices except your current one will be signed out immediately."
        confirmLabel="Revoke All"
        destructive
      />
    </AdminLayout>
  );
};
