import React, { useId } from 'react';

interface AreaLineChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  showArea?: boolean;
  valueFormatter?: (v: number) => string;
  /** Pulse the latest point (live data). Glow is always shown. Default: true. */
  live?: boolean;
}

const W = 100;
const H = 100;
const PAD_X = 3; // keeps the line + endpoint marker off the edges (no clipping)
const PAD_Y = 10;

/** Catmull-Rom → cubic-bézier smoothing for a soft, TradingView-style curve. */
function buildSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }
  const t = 0.2; // tension
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) * t;
    const cp1y = p1.y + (p2.y - p0.y) * t;
    const cp2x = p2.x - (p3.x - p1.x) * t;
    const cp2y = p2.y - (p3.y - p1.y) * t;
    d.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
  }
  return d.join(' ');
}

/** SVG trend/line chart with a soft area fill and a perfectly-circular, glowing
 *  live endpoint marker. Used for attendance, prediction confidence,
 *  occupancy-over-time, revenue trend, etc. */
export const AreaLineChart: React.FC<AreaLineChartProps> = ({
  data,
  labels,
  color = '#2563EB',
  height = 160,
  showArea = true,
  valueFormatter = (v) => String(v),
  live = true,
}) => {
  const gradientId = useId();

  // --- Empty guard: render a neutral placeholder rather than NaN geometry. ---
  if (!data || data.length === 0) {
    return <div style={{ height }} className="w-full rounded-[10px] bg-[#F8FAFC]" aria-hidden="true" />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;

  // Single-point guard: place it centered on a flat baseline (no divide-by-zero).
  const coords = data.map((v, i) => ({
    x: data.length === 1 ? W / 2 : PAD_X + (i / (data.length - 1)) * innerW,
    y: H - PAD_Y - ((v - min) / range) * innerH,
  }));

  const firstX = coords[0].x;
  const lastX = coords[coords.length - 1].x;
  const linePath = buildSmoothPath(coords);
  const areaPath = `${linePath} L ${lastX} ${H} L ${firstX} ${H} Z`;
  const lastPoint = coords[coords.length - 1];

  return (
    <div style={{ height }} className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {showArea && data.length > 1 && <path d={areaPath} fill={`url(#${gradientId})`} />}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      {/* Endpoint marker rendered as HTML → always a perfect circle regardless of
          the SVG's non-uniform scaling, with a soft glow + optional live pulse. */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${lastPoint.x}%`, top: `${lastPoint.y}%` }}
      >
        <span className="relative flex items-center justify-center">
          {live && (
            <span
              className="absolute h-3 w-3 rounded-full motion-safe:animate-ping motion-reduce:hidden"
              style={{ backgroundColor: color, opacity: 0.3 }}
            />
          )}
          <span
            className="relative block h-[7px] w-[7px] rounded-full ring-2 ring-white"
            style={{ backgroundColor: color, boxShadow: `0 0 6px 1px ${color}80` }}
          />
        </span>
      </div>

      <div className="absolute top-0 right-0 bg-[#141822] text-white text-[11px] px-2 py-1 rounded-[6px] -translate-y-1/2 font-mono">
        {valueFormatter(data[data.length - 1])}
      </div>
      {labels && (
        <div className="flex justify-between mt-1.5">
          {labels.map((l, i) => (
            <span key={`${l}-${i}`} className="text-[10px] font-medium text-[#94A3B8]">
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
