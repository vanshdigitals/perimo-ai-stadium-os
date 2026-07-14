import React, { useId } from 'react';

interface AreaLineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showArea?: boolean;
  valueFormatter?: (v: number) => string;
}

/** SVG trend/line chart with a soft area fill — used for attendance,
 *  prediction confidence, occupancy-over-time, revenue trend, etc. */
export const AreaLineChart: React.FC<AreaLineChartProps> = ({
  data,
  labels,
  color = '#2563EB',
  height = 160,
  showArea = true,
  valueFormatter = (v) => String(v),
}) => {
  const gradientId = useId();
  const w = 100;
  const h = 100;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padY = 8;

  const coords = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - padY - ((v - min) / range) * (h - padY * 2),
  }));

  const linePath = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;

  const lastPoint = coords[coords.length - 1];

  return (
    <div style={{ height }} className="relative w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showArea && <path d={areaPath} fill={`url(#${gradientId})`} />}
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {lastPoint && <circle cx={lastPoint.x} cy={lastPoint.y} r="1.8" fill={color} vectorEffect="non-scaling-stroke" />}
      </svg>
      <div className="absolute top-0 right-0 bg-[#141822] text-white text-[11px] px-2 py-1 rounded-[6px] -translate-y-1/2 font-mono">
        {valueFormatter(data[data.length - 1])}
      </div>
      {labels && (
        <div className="flex justify-between mt-1.5">
          {labels.map((l) => (
            <span key={l} className="text-[10px] font-medium text-[#94A3B8]">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
