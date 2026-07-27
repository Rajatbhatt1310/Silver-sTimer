import { Trophy } from "lucide-react";

export default function LeaderboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Leaderboard
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          See how your focus compares with others
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm text-zinc-400">
        <Trophy
          size={17}
          className="text-amber-400"
        />
        Focus Rankings
      </div>
    </div>
  );
}