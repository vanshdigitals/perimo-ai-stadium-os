import React from 'react';

/** Skeleton for a KPI tile row. */
export const KPISkeleton: React.FC = () => (
  <div className="bg-white border border-[#E2E8F0] rounded-[16px] p-4 h-full min-h-[104px] flex flex-col justify-between animate-pulse">
    <div className="flex items-center justify-between">
      <div className="w-16 h-3 bg-[#F1F5F9] rounded" />
      <div className="w-7 h-7 bg-[#F1F5F9] rounded-[8px]" />
    </div>
    <div className="w-20 h-6 bg-[#F1F5F9] rounded mt-2" />
    <div className="w-24 h-3 bg-[#F1F5F9] rounded mt-1.5" />
  </div>
);

/** Skeleton for generic widget body content (rows/lines). */
export const RowsSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="flex flex-col gap-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#F1F5F9] rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <div className="w-1/2 h-3 bg-[#F1F5F9] rounded" />
          <div className="w-3/4 h-2.5 bg-[#F8FAFC] rounded" />
        </div>
      </div>
    ))}
  </div>
);

/** Skeleton for a chart-shaped widget body. */
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 160 }) => (
  <div className="w-full bg-[#F8FAFC] rounded-[10px] animate-pulse" style={{ height }} />
);
