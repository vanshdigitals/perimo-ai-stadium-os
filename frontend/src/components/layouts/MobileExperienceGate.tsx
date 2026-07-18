import React, { useEffect, useState } from 'react';
import { Monitor, ArrowRight, Link2, Check } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const DISMISS_KEY = 'perimo_mobile_gate_dismissed';
const BREAKPOINT = '(max-width: 767px)';

/**
 * MobileExperienceGate — an elegant, non-blocking recommendation shown when the
 * Admin Command Center is opened on a small screen. It recommends a larger
 * display but never prevents access ("Continue Anyway" dismisses it for the
 * session). Mounted inside AdminLayout so it only applies to the admin panel.
 */
export const MobileExperienceGate: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(BREAKPOINT);
    const evaluate = () => {
      const dismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
      setVisible(mq.matches && !dismissed);
    };
    evaluate();
    mq.addEventListener('change', evaluate);
    return () => mq.removeEventListener('change', evaluate);
  }, []);

  if (!visible) return null;

  const continueAnyway = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      /* private mode — dismiss for this mount only */
    }
    setVisible(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white px-6 text-center"
      role="dialog"
      aria-modal="true"
      aria-label="Optimized for larger screens"
    >
      <div className="flex flex-col items-center max-w-[340px] w-full">
        <Logo showText className="mb-8" />

        <div
          className="w-16 h-16 rounded-[18px] bg-[#EFF6FF] flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <Monitor className="w-7 h-7 text-[#2563EB]" strokeWidth={1.75} />
        </div>

        <h1 className="font-display font-semibold text-[20px] text-[#0F172A] tracking-[-0.01em] mb-2.5">
          Best experienced on a larger screen
        </h1>
        <p className="text-[14px] leading-relaxed text-[#64748B] mb-8">
          PERIMO Command Center is optimized for larger screens for the best
          operational experience. You can continue on this device, or open it on a
          desktop.
        </p>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={continueAnyway}
            className="h-11 w-full rounded-[10px] bg-[#2563EB] text-white font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
          >
            Continue Anyway
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
          <button
            onClick={copyLink}
            className="h-11 w-full rounded-[10px] border border-[#E2E8F0] bg-white text-[#334155] font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#F1F5F9] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#1FAA6D]" strokeWidth={2.5} />
                Link copied
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" strokeWidth={2} />
                Open on Desktop
              </>
            )}
          </button>
        </div>

        <p className="text-[12px] text-[#94A3B8] mt-6">
          {copied
            ? 'Paste the link into a desktop browser to continue there.'
            : 'FIFA World Cup 2026 · AI Stadium Operations'}
        </p>
      </div>
    </div>
  );
};
