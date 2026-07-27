import Card from "../ui/Card.jsx";

const TONE_ICON_CLASSES = {
  primary: "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]",
  warning: "bg-amber-500/10 text-amber-400",
  xp: "bg-purple-500/10 text-purple-400",
  analytics: "bg-blue-500/10 text-blue-400",
  success: "bg-emerald-500/10 text-emerald-400",
};

export default function StatCard({
  eyebrow,
  value,
  subtitle,
  icon: Icon,
  tone = "primary",
  className = "",
}) {
  return (
    <Card hover padding="p-5" className={className}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
          {eyebrow}
        </span>
        {Icon && (
          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-lg",
              TONE_ICON_CLASSES[tone],
            ].join(" ")}
          >
            <Icon size={14} strokeWidth={2.25} />
          </span>
        )}
      </div>
      <p className="mt-3 text-[26px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
        {value}
      </p>
      {subtitle && (
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{subtitle}</p>
      )}
    </Card>
  );
}
