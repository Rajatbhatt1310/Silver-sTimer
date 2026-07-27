import Card from "../ui/Card.jsx";
import Avatar from "../ui/Avatar.jsx";

const RANK_COLORS = {
  1: "#f59e0b",
  2: "#9ca3af",
  3: "#b45309",
};

export default function LeaderboardPreview({
  title = "Leaderboard",
  period = "Weekly",
  entries = [],
}) {
  return (
    <Card padding="p-5" className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <span className="text-xs font-medium text-[var(--color-text-subtle)]">{period}</span>
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="flex items-center gap-3 rounded-xl px-1.5 py-2 hover:bg-white/[0.03] transition-colors duration-150"
          >
            <span
              className="w-4 text-center text-xs font-semibold"
              style={{ color: RANK_COLORS[entry.rank] ?? "var(--color-text-subtle)" }}
            >
              {entry.rank}
            </span>
            <Avatar initials={entry.initials} size="sm" ringColor={RANK_COLORS[entry.rank]} />
            <span className="min-w-0 flex-1 truncate text-sm text-[var(--color-text-primary)]">
              {entry.name}
            </span>
            <span className="text-sm font-semibold text-[var(--color-primary-light)]">
              {entry.xp.toLocaleString()} <span className="text-[var(--color-text-subtle)] font-normal">XP</span>
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
