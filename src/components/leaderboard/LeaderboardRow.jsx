import { Clock3, Flame } from "lucide-react";

export default function LeaderboardRow({
  user,
  isCurrentUser = false,
}) {
  return (
    <div
      className={`
        flex items-center gap-4
        rounded-xl border
        px-5 py-4
        transition-all
        ${
          isCurrentUser
            ? "border-emerald-500/30 bg-emerald-500/[0.06]"
            : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035]"
        }
      `}
    >
      <div className="w-10 shrink-0 text-center">
        <span
          className={`
            text-sm font-semibold
            ${
              isCurrentUser
                ? "text-emerald-400"
                : "text-zinc-500"
            }
          `}
        >
          #{user.rank}
        </span>
      </div>

      <div
        className="
          flex h-10 w-10
          shrink-0 items-center justify-center
          overflow-hidden rounded-full
          bg-white/[0.05]
        "
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-semibold text-zinc-400">
            {user.name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium text-white">
            {user.name}
          </p>

          {isCurrentUser && (
            <span className="text-xs font-medium text-emerald-400">
              You
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {user.focusHours}h
          </span>

          <span className="flex items-center gap-1">
            <Flame size={12} />
            {user.streak} day streak
          </span>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-white">
          {user.xp?.toLocaleString()}
        </p>

        <p className="text-xs text-zinc-600">
          XP
        </p>
      </div>
    </div>
  );
}