import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Toast } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';

const CONFIGS = {
  success: { icon: CheckCircle2, bg: 'bg-white border-l-4 border-[#1FAA6D]', iconColor: 'text-[#1FAA6D]', titleColor: 'text-[#0F172A]' },
  error:   { icon: XCircle,      bg: 'bg-white border-l-4 border-[#E5342B]', iconColor: 'text-[#E5342B]', titleColor: 'text-[#0F172A]' },
  warning: { icon: AlertTriangle, bg: 'bg-white border-l-4 border-[#D68A00]', iconColor: 'text-[#D68A00]', titleColor: 'text-[#0F172A]' },
  info:    { icon: Info,          bg: 'bg-white border-l-4 border-[#2563EB]', iconColor: 'text-[#2563EB]', titleColor: 'text-[#0F172A]' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const cfg = CONFIGS[toast.type];
  const Icon = cfg.icon;
  return (
    <div
      className={cn(
        'flex items-start gap-3 w-[360px] rounded-[12px] p-3.5 shadow-[0_8px_24px_rgba(11,14,20,0.14)] border border-[#E2E8F0] animate-in slide-in-from-right-full duration-300',
        cfg.bg
      )}
      role="alert"
    >
      <Icon className={cn('w-4.5 h-4.5 mt-0.5 shrink-0', cfg.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className={cn('text-[13px] font-semibold leading-tight', cfg.titleColor)}>{toast.title}</p>
        {toast.message && <p className="text-[12px] text-[#64748B] mt-0.5 leading-relaxed">{toast.message}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 items-end">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>,
    document.body
  );
};
