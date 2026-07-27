import { Bell } from "lucide-react";
import SearchBar from "../components/ui/SearchBar.jsx";

export default function TopNavbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search tasks, sessions...",
  hasUnreadNotifications = false,
  onNotificationsClick,
  className = "",
}) {
  return (
    <header
      className={[
        "flex h-[68px] shrink-0 items-center justify-between gap-4 border-b",
        "border-[var(--color-border)] bg-[var(--color-bg)] px-6",
        className,
      ].join(" ")}
    >
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      <div className="flex items-center">
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-primary)] hover:text-[var(--color-primary-light)]"
        >
          <Bell size={18} strokeWidth={2} />

          {hasUnreadNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-[var(--color-card)]" />
          )}
        </button>
      </div>
    </header>
  );
}