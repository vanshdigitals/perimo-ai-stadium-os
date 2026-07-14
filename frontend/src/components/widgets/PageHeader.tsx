import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  live?: boolean;
  actions?: React.ReactNode;
}

/** Standard page header used by every module: title, subtitle, optional
 *  "live" badge, and a right-aligned actions slot (export/create/etc). */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, live, actions }) => (
  <div className="flex items-center justify-between gap-4 mb-5">
    <div>
      <h1 className="font-display font-semibold text-[24px] text-[#0F172A] m-0 tracking-[-0.01em] flex items-center gap-2.5">
        {title}
        {live && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#1FAA6D] bg-[#1FAA6D]/10 px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1FAA6D] animate-perimo-pulse" />
            Live
          </span>
        )}
      </h1>
      {subtitle && <p className="text-[14px] text-[#64748B] mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
