import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prevent closing on backdrop click */
  disableBackdropClose?: boolean;
}

const SIZE_MAP = {
  sm: 'max-w-[400px]',
  md: 'max-w-[540px]',
  lg: 'max-w-[680px]',
  xl: 'max-w-[860px]',
};

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, subtitle, children, footer, size = 'md', disableBackdropClose = false,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
        onClick={disableBackdropClose ? undefined : onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full bg-white rounded-[16px] shadow-[0_24px_64px_rgba(11,14,20,0.22)] border border-[#E2E8F0] flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-200',
          SIZE_MAP[size]
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-semibold text-[16px] text-[#0F172A] leading-tight">{title}</h2>
            {subtitle && <p className="text-[13px] text-[#64748B] mt-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 w-7 h-7 rounded-[8px] text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] rounded-b-[16px] flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// ── Confirm Dialog ────────────────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  destructive = false, loading = false,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    disableBackdropClose={loading}
    footer={
      <>
        <button
          onClick={onClose}
          disabled={loading}
          className="h-[36px] px-4 rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569] font-medium text-[13px] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={cn(
            'h-[36px] px-4 rounded-[8px] font-medium text-[13px] transition-colors text-white disabled:opacity-60 flex items-center gap-2',
            destructive ? 'bg-[#E5342B] hover:bg-[#C4291C]' : 'bg-[#2563EB] hover:bg-[#1D4ED8]'
          )}
        >
          {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {confirmLabel}
        </button>
      </>
    }
  >
    <p className="text-[14px] text-[#334155] leading-relaxed">{message}</p>
  </Modal>
);
