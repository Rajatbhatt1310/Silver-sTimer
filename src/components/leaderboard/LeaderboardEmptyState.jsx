import { Trophy } from "lucide-react";

export default function LeaderboardEmptyState() {
  return (
    <div
      className="
        flex min-h-[420px]
        flex-col items-center justify-center
        rounded-2xl
        border border-white/[0.07]
        bg-white/[0.02]
        text-center
      "
    >
      <div
        className="
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-amber-500/10
          text-amber-400
        "
      >
        <Trophy size={25} />
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        Rankings are coming soon
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Complete focus sessions and earn XP to climb the leaderboard.
      </p>
    </div>
  );
}