const SIZE_CLASSES = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
};

export default function Avatar({
  src,
  initials = "",
  size = "md",
  ringColor,
  status,
  className = "",
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={[
          "inline-flex items-center justify-center rounded-full font-semibold uppercase overflow-hidden",
          "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]",
          SIZE_CLASSES[size],
          ringColor ? "ring-2" : "",
          className,
        ].join(" ")}
        style={ringColor ? { boxShadow: `0 0 0 2px ${ringColor}` } : undefined}
      >
        {src ? (
          <img src={src} alt={initials || "avatar"} className="h-full w-full object-cover" />
        ) : (
          initials
        )}
      </span>
      {status && (
        <span
          className={[
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-card)]",
            status === "online" ? "bg-[var(--color-primary)]" : "bg-[var(--color-text-subtle)]",
          ].join(" ")}
        />
      )}
    </span>
  );
}
