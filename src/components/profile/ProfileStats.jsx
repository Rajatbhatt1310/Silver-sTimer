import {
  Flame,
  Star,
  Clock3,
  Trophy,
} from "lucide-react";

const STATS = [
  {
    key: "level",
    label: "Level",
    icon: Star,
  },
  {
    key: "xp",
    label: "Total XP",
    icon: Trophy,
  },
  {
    key: "focusHours",
    label: "Focus Hours",
    icon: Clock3,
  },
  {
    key: "streak",
    label: "Current Streak",
    icon: Flame,
  },
];

export default function ProfileStats({
  stats,
}) {
  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {STATS.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="
              rounded-2xl
              border border-white/[0.07]
              bg-white/[0.02]
              p-5
            "
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Icon size={17} />
            </div>

            <p className="mt-5 text-2xl font-bold text-white">
              {stats[item.key]}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}