import React from 'react';

export interface BarChartDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartProps {
  data: BarChartDatum[];
  maxValue?: number;
  color?: string;
  highlightColor?: string;
  height?: number;
  valueFormatter?: (v: number) => string;
}

/** Simple vertical bar chart, hand-rolled with divs (matches the rest of the
 *  app's chart pattern — no charting library dependency). */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  color = '#E2E5EA',
  highlightColor = '#1652F0',
  height = 140,
  valueFormatter = (v) => String(v),
}) => {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => {
        const pct = Math.max(4, Math.min(100, (d.value / max) * 100));
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full group/bar relative">
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#141822] text-white text-[11px] px-2.5 py-1.5 rounded-[6px] opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap shadow-[0_4px_12px_rgba(10,14,20,0.15)]">
              {valueFormatter(d.value)}
            </div>
            <div
              className="w-full rounded-t-[4px] transition-colors"
              style={{ height: `${pct}%`, backgroundColor: d.highlight ? highlightColor : color }}
            />
            <span className="text-[10px] font-medium text-[#94A3B8] mt-1.5 truncate max-w-full">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};
