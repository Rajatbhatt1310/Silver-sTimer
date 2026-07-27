import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
}) {
  return (
    <label
      className={[
        "flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]",
        "px-3.5 h-10 text-sm text-[var(--color-text-muted)] focus-within:border-[var(--color-border-strong)]",
        "transition-colors duration-150 w-full max-w-md",
        className,
      ].join(" ")}
    >
      <Search size={16} strokeWidth={2.25} className="shrink-0 text-[var(--color-text-subtle)]" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-[var(--color-text-subtle)] text-[var(--color-text-primary)]"
      />
    </label>
  );
}
