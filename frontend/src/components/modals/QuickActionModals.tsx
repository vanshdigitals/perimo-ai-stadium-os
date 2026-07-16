/**
 * All Quick Action modals — Broadcast, Incident, Deploy, SitRep, Export, Lockdown
 * Each modal is self-contained and uses Modal + AppContext.
 */
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';
import { Radio, AlertTriangle, Users, FileText, Download, ShieldAlert, CheckCircle2 } from 'lucide-react';

// ── Shared field components ───────────────────────────────────────────────────
const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[13px] font-semibold text-[#344055]">{label}</label>
    {children}
  </div>
);

const inputCls = 'h-[40px] rounded-[8px] border border-[#E2E8F0] px-3 text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all w-full';
const textareaCls = 'rounded-[8px] border border-[#E2E8F0] px-3 py-2.5 text-[13px] outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all w-full resize-none';
const selectCls = `${inputCls} cursor-pointer bg-white`;

const BtnPrimary: React.FC<{ children: React.ReactNode; onClick?: () => void; destructive?: boolean; loading?: boolean; disabled?: boolean }> = ({ children, onClick, destructive, loading, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={cn(
      'h-[36px] px-5 rounded-[8px] font-medium text-[13px] transition-colors text-white flex items-center gap-2 disabled:opacity-60',
      destructive ? 'bg-[#E5342B] hover:bg-[#C4291C]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
    )}
  >
    {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
    {children}
  </button>
);

const BtnSecondary: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors">
    {children}
  </button>
);

const SuccessBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[10px] animate-in fade-in duration-300">
    <CheckCircle2 className="w-5 h-5 text-[#1FAA6D] shrink-0" />
    <p className="text-[13px] font-medium text-[#14532D]">{message}</p>
  </div>
);

// ── 1. Broadcast Alert ────────────────────────────────────────────────────────
export const BroadcastAlertModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast, addNotification, user } = useApp();
  const [severity, setSeverity] = useState('warning');
  const [audience, setAudience] = useState('all-staff');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast({ type: 'success', title: 'Alert Broadcast', message: `Delivered to ${audience === 'all-staff' ? 'all staff' : audience} at ${new Date().toLocaleTimeString()}` });
      addNotification({ type: severity as any, title: 'Broadcast Alert Sent', desc: `${user.displayName} broadcast: "${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"`, time: 'Just now' });
      setTimeout(onClose, 1500);
    }, 1200);
  };

  const handleClose = () => { setSent(false); setMessage(''); setLoading(false); onClose(); };

  return (
    <Modal
      open={open} onClose={handleClose} title="Broadcast Alert" size="md"
      subtitle="Send an urgent notification to selected recipients."
      footer={!sent ? (
        <>
          <BtnSecondary onClick={handleClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleSend} loading={loading} disabled={!message.trim()}>
            <Radio className="w-3.5 h-3.5" /> Send Alert
          </BtnPrimary>
        </>
      ) : undefined}
    >
      {sent ? <SuccessBanner message="Alert successfully broadcast to all recipients." /> : (
        <div className="flex flex-col gap-4">
          <Field label="Audience">
            <select value={audience} onChange={e => setAudience(e.target.value)} className={selectCls}>
              <option value="all-staff">All Staff</option>
              <option value="security">Security Team</option>
              <option value="medical">Medical Team</option>
              <option value="transport">Transport Team</option>
              <option value="all">Everyone (Staff + Volunteers)</option>
            </select>
          </Field>
          <Field label="Severity">
            <div className="flex gap-2">
              {[
                { value: 'info', label: 'Info', color: 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' },
                { value: 'warning', label: 'Warning', color: 'border-[#D68A00] bg-[#FFFBEB] text-[#D68A00]' },
                { value: 'critical', label: 'Critical', color: 'border-[#E5342B] bg-[#FEF2F2] text-[#E5342B]' },
              ].map(s => (
                <button
                  key={s.value}
                  onClick={() => setSeverity(s.value)}
                  className={cn(
                    'flex-1 h-9 rounded-[8px] border-2 text-[12px] font-semibold transition-all',
                    severity === s.value ? s.color : 'border-[#E2E8F0] text-[#64748B] bg-white hover:bg-[#F8FAFC]'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Message">
            <textarea value={message} onChange={e => setMessage(e.target.value)} className={textareaCls} rows={4} placeholder="Type your alert message here..." />
          </Field>
          {message.trim() && (
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px]">
              <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Preview</p>
              <p className="text-[13px] text-[#334155]">{message}</p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

// ── 2. Create Incident ────────────────────────────────────────────────────────
export const CreateIncidentModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast, addNotification, user } = useApp();
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    if (!title.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const id = `INC-${Math.floor(Math.random() * 9000) + 1000}`;
      setLoading(false);
      setCreated(true);
      toast({ type: 'success', title: `Incident ${id} Created`, message: `${title} — escalated to ${severity} priority` });
      addNotification({ type: severity === 'critical' ? 'critical' : severity === 'high' ? 'warning' : 'info', title: `New Incident: ${title}`, desc: `${id} created by ${user.displayName}. ${description.slice(0, 80)}`, time: 'Just now' });
      setTimeout(onClose, 1500);
    }, 1000);
  };

  const handleClose = () => { setCreated(false); setTitle(''); setDescription(''); setLoading(false); onClose(); };

  return (
    <Modal
      open={open} onClose={handleClose} title="Create Incident" size="md"
      subtitle="Log a new incident into the PERIMO incident management system."
      footer={!created ? (
        <>
          <BtnSecondary onClick={handleClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleCreate} loading={loading} disabled={!title.trim()}>
            <AlertTriangle className="w-3.5 h-3.5" /> Create Incident
          </BtnPrimary>
        </>
      ) : undefined}
    >
      {created ? <SuccessBanner message="Incident created and logged to the incident ledger." /> : (
        <div className="flex flex-col gap-4">
          <Field label="Title *">
            <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} placeholder="e.g. Medical Emergency — Gate B" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Severity">
              <select value={severity} onChange={e => setSeverity(e.target.value)} className={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </Field>
            <Field label="Location">
              <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="e.g. Sector B, Gate 3" />
            </Field>
          </div>
          <Field label="Description">
            <textarea value={description} onChange={e => setDescription(e.target.value)} className={textareaCls} rows={3} placeholder="Describe the incident in detail..." />
          </Field>
        </div>
      )}
    </Modal>
  );
};

// ── 3. Deploy Team ────────────────────────────────────────────────────────────
export const DeployTeamModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast, addNotification, user } = useApp();
  const [team, setTeam] = useState('security-alpha');
  const [location, setLocation] = useState('');
  const [priority, setPriority] = useState('standard');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDeployed(true);
      toast({ type: 'success', title: 'Team Deployed', message: `${team.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} dispatched to ${location || 'assigned area'}` });
      addNotification({ type: 'info', title: 'Team Deployed', desc: `${user.displayName} deployed ${team.replace(/-/g, ' ')} to ${location}`, time: 'Just now' });
      setTimeout(onClose, 1500);
    }, 1000);
  };

  const handleClose = () => { setDeployed(false); setLocation(''); setLoading(false); onClose(); };

  return (
    <Modal
      open={open} onClose={handleClose} title="Deploy Team" size="md"
      subtitle="Dispatch an operational team to a specified location."
      footer={!deployed ? (
        <>
          <BtnSecondary onClick={handleClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleDeploy} loading={loading}>
            <Users className="w-3.5 h-3.5" /> Deploy
          </BtnPrimary>
        </>
      ) : undefined}
    >
      {deployed ? <SuccessBanner message="Team has been deployed and notified via radio and app." /> : (
        <div className="flex flex-col gap-4">
          <Field label="Team">
            <select value={team} onChange={e => setTeam(e.target.value)} className={selectCls}>
              <option value="security-alpha">Security Alpha</option>
              <option value="security-bravo">Security Bravo</option>
              <option value="medical-response">Medical Response Unit</option>
              <option value="crowd-management">Crowd Management</option>
              <option value="transport-ops">Transport Operations</option>
              <option value="volunteer-coord">Volunteer Coordinators</option>
            </select>
          </Field>
          <Field label="Deployment Location">
            <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="e.g. Gate C, Sector 4" />
          </Field>
          <Field label="Priority">
            <div className="flex gap-2">
              {['standard', 'urgent', 'emergency'].map(p => (
                <button key={p} onClick={() => setPriority(p)} className={cn('flex-1 h-9 rounded-[8px] border-2 text-[12px] font-semibold capitalize transition-all', priority === p ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] text-[#64748B] bg-white hover:bg-[#F8FAFC]')}>
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Briefing Notes">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className={textareaCls} rows={2} placeholder="Additional instructions for the team..." />
          </Field>
        </div>
      )}
    </Modal>
  );
};

// ── 4. Situation Report ───────────────────────────────────────────────────────
const SITREP_CONTENT = `PERIMO SITUATION REPORT
Generated: ${new Date().toLocaleString()}
Operator: Vansh (vansh@perimo.ai)
Stadium: Santiago Bernabéu

CROWD STATUS
• Current occupancy: 74,218 / 81,044 (91.6%)
• Gate throughput: Normal on A, B, D — Gate C below nominal
• Density hotspots: Section 112, Concourse Level 2

ACTIVE INCIDENTS
• INC-2041: Medical Emergency — Sector B Row 18 [CRITICAL, Medical dispatched]
• INC-2039: Parking Zone P2 Full — Overflow rerouted [MEDIUM, Resolved]

SECURITY
• All perimeter zones: CLEAR
• Active patrol teams: 8 (Security Alpha, Bravo, Charlie, Delta)
• CCTV systems: 142/144 operational

AI RECOMMENDATIONS
• Reroute Gate C traffic to Gate D (projected 8-min improvement)
• Pre-position medical team at Section 105 for halftime crowds
• Deploy additional concession staff — queues exceed 15 mins

OVERALL STATUS: AMBER — All systems operational with active monitoring.`;

export const SituationReportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast } = useApp();
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setReady(true); }, 1500);
  };

  const handleClose = () => { setReady(false); setGenerating(false); onClose(); };

  return (
    <Modal
      open={open} onClose={handleClose} title="Situation Report" size="lg"
      subtitle="AI-generated operational summary of all active systems."
      footer={
        <>
          <BtnSecondary onClick={handleClose}>Close</BtnSecondary>
          {!ready && <BtnPrimary onClick={handleGenerate} loading={generating}><FileText className="w-3.5 h-3.5" /> Generate Report</BtnPrimary>}
          {ready && (
            <BtnPrimary onClick={() => { toast({ type: 'success', title: 'Report Exported', message: 'situation_report.pdf downloaded' }); }}>
              <Download className="w-3.5 h-3.5" /> Export PDF
            </BtnPrimary>
          )}
        </>
      }
    >
      {generating && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
          <p className="text-[14px] font-medium text-[#64748B]">Analysing all systems with PERIMO AI...</p>
        </div>
      )}
      {!generating && !ready && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <FileText className="w-10 h-10 text-[#CBD5E1]" />
          <p className="text-[14px] font-medium text-[#334155]">Generate a comprehensive situation report</p>
          <p className="text-[13px] text-[#64748B]">The AI will analyse all active incidents, crowd data, security status, and system health to produce a real-time operational summary.</p>
        </div>
      )}
      {ready && (
        <pre className="text-[12px] font-mono text-[#334155] bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] p-4 whitespace-pre-wrap leading-relaxed overflow-auto max-h-[400px]">
          {SITREP_CONTENT}
        </pre>
      )}
    </Modal>
  );
};

// ── 5. Export Report ──────────────────────────────────────────────────────────
export const ExportReportModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast } = useApp();
  const [format, setFormat] = useState<'pdf' | 'csv' | 'json'>('pdf');
  const [range, setRange] = useState('today');
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ type: 'success', title: 'Report Exported', message: `perimo_report_${new Date().toISOString().split('T')[0]}.${format} downloaded` });
      onClose();
    }, 1500);
  };

  return (
    <Modal
      open={open} onClose={onClose} title="Export Report" size="sm"
      subtitle="Download a report of system activity."
      footer={
        <>
          <BtnSecondary onClick={onClose}>Cancel</BtnSecondary>
          <BtnPrimary onClick={handleExport} loading={loading}>
            <Download className="w-3.5 h-3.5" /> Export {format.toUpperCase()}
          </BtnPrimary>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Format">
          <div className="flex gap-2">
            {(['pdf', 'csv', 'json'] as const).map(f => (
              <button key={f} onClick={() => setFormat(f)} className={cn('flex-1 h-9 rounded-[8px] border-2 text-[12px] font-bold uppercase transition-all', format === f ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] text-[#64748B] bg-white hover:bg-[#F8FAFC]')}>
                {f}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Date Range">
          <select value={range} onChange={e => setRange(e.target.value)} className={selectCls}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
};

// ── 6. Emergency Lockdown ─────────────────────────────────────────────────────
export const EmergencyLockdownModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { toast, addNotification, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [input, setInput] = useState('');

  const handleExecute = () => {
    if (input !== 'LOCKDOWN') return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setExecuted(true);
      toast({ type: 'error', title: 'Emergency Lockdown Activated', message: 'All non-emergency access suspended. Incident logged.', duration: 8000 });
      addNotification({ type: 'critical', title: 'EMERGENCY LOCKDOWN ACTIVATED', desc: `Initiated by ${user.displayName} at ${new Date().toLocaleTimeString()}. All systems on high alert.`, time: 'Just now' });
    }, 2000);
  };

  const handleClose = () => { setExecuted(false); setInput(''); setLoading(false); onClose(); };

  return (
    <Modal open={open} onClose={handleClose} title="Emergency Lockdown" size="sm" disableBackdropClose={loading}
      subtitle="This will suspend all non-emergency access immediately."
      footer={!executed ? (
        <>
          <BtnSecondary onClick={handleClose}>Cancel</BtnSecondary>
          <BtnPrimary destructive onClick={handleExecute} disabled={input !== 'LOCKDOWN'} loading={loading}>
            <ShieldAlert className="w-3.5 h-3.5" /> Execute Lockdown
          </BtnPrimary>
        </>
      ) : undefined}
    >
      {executed ? (
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[#E5342B]" />
          </div>
          <p className="text-[14px] font-bold text-[#0F172A]">Lockdown Active</p>
          <p className="text-[13px] text-[#64748B]">All non-emergency access has been suspended. Security teams are on high alert.</p>
          <button onClick={handleClose} className="mt-2 h-9 px-5 rounded-[8px] bg-[#F1F5F9] text-[13px] font-medium text-[#334155] hover:bg-[#E2E8F0] transition-colors">
            Close
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-[#FEF2F2] border border-[#FECACA] rounded-[10px]">
            <p className="text-[13px] font-semibold text-[#991B1B] mb-1">⚠ Destructive Action</p>
            <p className="text-[12px] text-[#B91C1C] leading-relaxed">This will immediately suspend all non-emergency gate access, lock down all sectors, and alert all security teams. This action will be logged and audited.</p>
          </div>
          <Field label="Type LOCKDOWN to confirm">
            <input
              value={input}
              onChange={e => setInput(e.target.value.toUpperCase())}
              className={cn(inputCls, input === 'LOCKDOWN' ? 'border-[#E5342B] ring-1 ring-[#E5342B]' : '')}
              placeholder="LOCKDOWN"
              autoComplete="off"
            />
          </Field>
        </div>
      )}
    </Modal>
  );
};
