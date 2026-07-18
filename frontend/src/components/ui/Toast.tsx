import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { Toast } from '@/contexts/AppContext';
import { cn } from '@/utils/cn';

const CONFIGS = {
  success: { icon: CheckCircle2, iconColor: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  error:   { icon: XCircle,      iconColor: 'text-red-500', bg: 'bg-red-50/50' },
  warning: { icon: AlertTriangle, iconColor: 'text-amber-500', bg: 'bg-amber-50/50' },
  info:    { icon: Info,          iconColor: 'text-blue-500', bg: 'bg-blue-50/50' },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cfg = CONFIGS[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    // Small delay to trigger animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for animation to finish before removing
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 w-full max-w-[380px] bg-white/80 backdrop-blur-xl border border-[#E2E8F0] shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl transition-all duration-300 ease-out overflow-hidden pointer-events-auto",
        isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-8 opacity-0 scale-95"
      )}
    >
      {/* Subtle Background Accent */}
      <div className={cn("absolute inset-0 opacity-50 pointer-events-none", cfg.bg)} />

      <div className="relative z-10 shrink-0">
        <Icon className={cn("w-5 h-5", cfg.iconColor)} strokeWidth={2.5} />
      </div>

      <div className="relative z-10 flex-1 min-w-0 pt-0.5">
        <p className="text-[14px] font-semibold text-[#0F172A] leading-tight mb-1">{toast.title}</p>
        {toast.message && (
          <p className="text-[13px] text-[#475569] leading-snug">{toast.message}</p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="relative z-10 shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-full px-4">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
};
