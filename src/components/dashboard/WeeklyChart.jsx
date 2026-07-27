import { useId, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import Card from "../ui/Card.jsx";

// Builds a smooth SVG path through a set of points using quadratic midpoints.
function buildSmoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    path += ` Q ${current.x} ${current.y} ${midX} ${(current.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  path += ` T ${last.x} ${last.y}`;
  return path;
}

export default function WeeklyChart({
  title = "Weekly Study Time",
  totalLabel,
  deltaLabel,
  deltaPositive = true,
  data = [],
  yTicks = 4,
  height = 200,
}) {
  const gradientId = useId();
  const width = 700;
  const paddingX = 12;
  const paddingY = 16;

  const maxValue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 1);
    return Math.ceil(max / 2) * 2;
  }, [data]);

  const points = useMemo(() => {
    if (data.length === 0) return [];
    const step = (width - paddingX * 2) / (data.length - 1 || 1);
    return data.map((d, i) => ({
      x: paddingX + step * i,
      y: paddingY + (1 - d.value / maxValue) * (height - paddingY * 2),
      label: d.label,
      value: d.value,
    }));
  }, [data, maxValue, height]);

  const linePath = buildSmoothPath(points);
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${
          height - paddingY
        } Z`
      : "";

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => Math.round((maxValue / yTicks) * i));

  return (
    <Card padding="p-6" className="flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
          {totalLabel && (
            <p className="mt-0.5 text-sm text-[var(--color-text-muted)]">{totalLabel}</p>
          )}
        </div>
        {deltaLabel && (
          <span
            className={[
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
              deltaPositive
                ? "text-[var(--color-primary-light)] bg-[var(--color-primary-dim)]"
                : "text-amber-400 bg-amber-500/10",
            ].join(" ")}
          >
            <TrendingUp size={12} strokeWidth={2.5} />
            {deltaLabel}
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <div
          className="flex flex-col justify-between text-[11px] text-[var(--color-text-subtle)] py-1"
          style={{ height }}
        >
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => {
              const y = paddingY + (1 - tick / maxValue) * (height - paddingY * 2);
              return (
                <line
                  key={tick}
                  x1={paddingX}
                  x2={width - paddingX}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="1"
                />
              );
            })}

            {areaPath && (
              <motion.path
                d={areaPath}
                fill={`url(#${gradientId})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}
            {linePath && (
              <motion.path
                d={linePath}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            )}
          </svg>

          <div className="mt-2 flex justify-between px-0.5 text-[11px] text-[var(--color-text-subtle)]">
            {points.map((p) => (
              <span key={p.label}>{p.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
