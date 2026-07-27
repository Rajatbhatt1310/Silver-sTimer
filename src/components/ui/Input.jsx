export default function Input({
  label,
  icon: Icon,
  className = "",
  containerClassName = "",
  ...rest
}) {
  return (
    <div className={["flex flex-col gap-1.5", containerClassName].join(" ")}>
      {label && (
        <span className="text-xs font-medium text-[var(--color-text-muted)]">{label}</span>
      )}
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] h-10 px-3.5 focus-within:border-[var(--color-border-strong)] transition-colors duration-150">
        {Icon && <Icon size={16} strokeWidth={2.25} className="text-[var(--color-text-subtle)]" />}
        <input
          className={[
            "w-full bg-transparent outline-none text-sm text-[var(--color-text-primary)]",
            "placeholder:text-[var(--color-text-subtle)]",
            className,
          ].join(" ")}
          {...rest}
        />
      </div>
    </div>
  );
}
