import React from 'react';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSlice[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

/** SVG donut chart for distributions (severity mix, resource allocation, etc). */
export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 120, thickness = 14, centerLabel, centerValue }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={thickness} />
          {data.map((d) => {
            const dash = (d.value / total) * circumference;
            const circle = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offsetAcc}
                strokeLinecap="butt"
              />
            );
            offsetAcc += dash;
            return circle;
          })}
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-[18px] font-semibold text-[#0F172A] font-mono">{centerValue}</span>}
            {centerLabel && <span className="text-[10px] text-[#94A3B8]">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 min-w-0">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-[12px]">
            <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-[#475569] truncate">{d.label}</span>
            <span className="text-[#94A3B8] font-mono shrink-0 ml-auto pl-2">{Math.round((d.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
