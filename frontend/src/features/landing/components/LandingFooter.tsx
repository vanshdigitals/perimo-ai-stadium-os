import React, { useState } from 'react';
import { ArrowRight, Globe, Mail, Send, MessageSquareText } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/utils/cn';
import { FOOTER_COLUMNS } from '../data';

const SOCIALS = [
  { icon: Globe, label: 'Website' },
  { icon: MessageSquareText, label: 'Community' },
  { icon: Send, label: 'Contact' },
  { icon: Mail, label: 'Email' },
];

export const LandingFooter: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className={cn('border-t', isDark ? 'border-[#181D28] bg-[#080B11]' : 'border-[#E2E4E9] bg-[#FAFBFC]')}>
      <div className="mx-auto max-w-[1340px] px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[3fr_5fr] lg:gap-16">
          {/* Brand + newsletter */}
          <div>
            <Logo theme={isDark ? 'dark' : 'light'} />
            <p className={cn('mt-5 max-w-[300px] text-[14px] leading-[1.65]', isDark ? 'text-[#8A93A3]' : 'text-[#64748B]')}>
              The AI Operating System for modern stadium experiences — built for the world's biggest events.
            </p>

            <form onSubmit={submit} className="mt-8 max-w-[340px]">
              <label htmlFor="footer-email" className={cn('text-[12.5px] font-semibold', isDark ? 'text-[#C7CDD6]' : 'text-[#334155]')}>
                Stay in the loop
              </label>
              <div className="mt-3 flex items-center gap-2">
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className={cn(
                    'h-12 flex-1 rounded-[10px] border px-3.5 text-[13.5px] outline-none transition-colors focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]',
                    isDark ? 'border-[#232838] bg-[#111622] text-white placeholder:text-[#5B6472]' : 'border-[#E2E4E9] bg-white text-[#0F172A] placeholder:text-[#94A3B8]',
                  )}
                />
                <button type="submit" aria-label="Subscribe" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] bg-[#2563EB] text-white transition-colors hover:bg-[#1D4ED8] outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2">
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
                </button>
              </div>
              {subscribed && <p className="mt-2 text-[12.5px] font-medium text-[#16A34A]">Thanks — you're on the list.</p>}
            </form>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className={cn('text-[12.5px] font-bold uppercase tracking-[0.1em]', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className={cn('text-[13.5px] transition-colors', isDark ? 'text-[#9AA3B2] hover:text-white' : 'text-[#475569] hover:text-[#0F172A]')}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={cn('mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row', isDark ? 'border-[#181D28]' : 'border-[#E2E4E9]')}>
          <p className={cn('text-[13px]', isDark ? 'text-[#6B7688]' : 'text-[#94A3B8]')}>© {new Date().getFullYear()} PERIMO · AI Stadium OS. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className={cn('flex h-9 w-9 items-center justify-center rounded-lg transition-colors', isDark ? 'text-[#8A93A3] hover:bg-white/5 hover:text-white' : 'text-[#64748B] hover:bg-black/[0.04] hover:text-[#0F172A]')}>
                <s.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
