import Avatar from "../ui/Avatar.jsx";

export default function UserCard({ name, level, title, avatarSrc, onClick, className = "" }) {
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)]",
        "bg-[var(--color-card)] px-3 py-2.5 text-left transition-colors duration-150",
        "hover:border-[var(--color-border-strong)] hover:bg-[var(--color-card-hover)]",
        className,
      ].join(" ")}
    >
      <Avatar src={avatarSrc} initials={initials} status="online" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
          {name}
        </span>
        <span className="block truncate text-xs text-[var(--color-text-muted)]">
          {level ? `Level ${level}` : null}
          {level && title ? " · " : null}
          {title}
        </span>
      </span>
    </button>
  );
}
