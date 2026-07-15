import React from 'react';
import { cn } from '@/utils/cn';
import { TRUST_ITEMS } from '../data';

export const TrustFooter: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <footer className={cn('border-t py-10', isDark ? 'border-[#181D28] bg-[#0A0E14]' : 'border-black/[0.06] bg-[#FAFAFB]')}>
    <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', isDark ? 'bg-[#141822] text-[#7CA6FF]' : 'bg-[#2563EB]/10 text-[#2563EB]')}>
              <item.icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <div className={cn('text-[13.5px] font-semibold', isDark ? 'text-[#E5E9F0]' : 'text-[#0F172A]')}>{item.title}</div>
              <div className={cn('mt-0.5 text-[12px] leading-snug', isDark ? 'text-[#5B6472]' : 'text-[#94A3B8]')}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={cn('mt-10 border-t pt-6 text-center text-[12px]', isDark ? 'border-[#181D28] text-[#5B6472]' : 'border-black/[0.06] text-[#94A3B8]')}>
        © {new Date().getFullYear()} PERIMO AI Operating System. All rights reserved.
      </div>
    </div>
  </footer>
);
