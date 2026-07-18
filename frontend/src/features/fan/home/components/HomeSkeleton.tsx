import React from 'react';


export const HomeSkeleton: React.FC = () => {
  return (
    <div className="p-4 lg:p-8 space-y-8 animate-pulse w-full max-w-[1200px] mx-auto">
      {/* Hero Skeleton */}
      <div className="w-full h-[420px] lg:h-[480px] bg-slate-200 rounded-[28px] lg:rounded-[36px]" />
      
      {/* Quick Actions Skeleton */}
      <div>
        <div className="w-32 h-4 bg-slate-200 rounded-full mb-4" />
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-[20px]" />
          ))}
        </div>
      </div>
      
      {/* Live Info Skeleton */}
      <div>
        <div className="w-40 h-4 bg-slate-200 rounded-full mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
          ))}
          <div className="col-span-2 md:col-span-4 h-20 bg-slate-200 rounded-2xl" />
        </div>
      </div>
      
      {/* Match Preview Skeleton */}
      <div className="h-48 md:h-64 bg-slate-200 rounded-[24px]" />
    </div>
  );
};
