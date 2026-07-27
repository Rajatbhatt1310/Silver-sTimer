import { Target } from "lucide-react";

export default function UserRankCard({
  user,
}) {
  if (!user) return null;

  return (
    <div
      className="
        flex items-center gap-4
        rounded-2xl
        border border-emerald-500/20
        bg-emerald-500/[0.05]
        p-5
      "
    >
      <div
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          bg-emerald-500/10
          text-emerald-400
        "
      >
        <Target size={19} />
      </div>

      <div className="flex-1">
        <p className="text-xs text-zinc-500">
          Your Rank
        </p>

        <p className="mt-1 text-sm font-semibold text-white">
          #{user.rank}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-white">
          {user.xp?.toLocaleString()} XP
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {user.focusHours}h focused
        </p>
      </div>
    </div>
  );
}