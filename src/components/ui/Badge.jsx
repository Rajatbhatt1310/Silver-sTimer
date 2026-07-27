const TONE_CLASSES = {
  default: "bg-white/5 text-[var(--color-text-muted)] border-[var(--color-border)]",
  primary: "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)] border-transparent",
  success: "bg-emerald-500/10 text-emerald-400 border-transparent",
  warning: "bg-amber-500/10 text-amber-400 border-transparent",
  xp: "bg-purple-500/10 text-purple-400 border-transparent",
  analytics: "bg-blue-500/10 text-blue-400 border-transparent",
};

export default function Badge({ children, tone = "default", icon: Icon, className = "" }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      ].join(" ")}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
