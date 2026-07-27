import { motion } from "framer-motion";

const TONE_CLASSES = {
  primary: "bg-[var(--color-primary)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  xp: "bg-[var(--color-xp)]",
  analytics: "bg-[var(--color-analytics)]",
};

export default function ProgressBar({
  value = 0,
  max = 100,
  tone = "primary",
  trackClassName = "",
  barClassName = "",
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={[
        "h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]",
        trackClassName,
      ].join(" ")}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={["h-full rounded-full", TONE_CLASSES[tone], barClassName].join(" ")}
      />
    </div>
  );
}
