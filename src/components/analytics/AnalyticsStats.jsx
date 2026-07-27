import {
  Clock3,
  Flame,
  Target,
  Zap,
} from "lucide-react";


function formatFocusTime(minutes = 0) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remainingMinutes =
    minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}


export default function AnalyticsStats({
  stats,
}) {
  if (!stats) {
    return null;
  }


  const items = [
    {
      key: "total-focus",
      label: "Total Focus",
      value: formatFocusTime(
        stats.totalFocusMinutes
      ),
      icon: Clock3,
    },

    {
      key: "sessions",
      label: "Sessions",
      value:
        stats.sessionsCompleted,
      icon: Zap,
    },

    {
      key: "focus-score",
      label: "Focus Score",
      value:
        `${stats.focusScore}%`,
      icon: Target,
    },

    {
      key: "streak",
      label: "Current Streak",
      value:
        `${stats.currentStreak} ${
          stats.currentStreak === 1
            ? "day"
            : "days"
        }`,
      icon: Flame,
    },
  ];


  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.key}
            className="
              rounded-2xl
              border border-white/[0.07]
              bg-white/[0.025]
              p-5
            "
          >

            <div className="flex items-center justify-between">

              <p className="text-sm text-zinc-500">
                {item.label}
              </p>

              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-xl
                  bg-emerald-500/10
                  text-emerald-400
                "
              >
                <Icon size={17} />
              </div>

            </div>

            <p className="mt-5 text-2xl font-bold text-white">
              {item.value}
            </p>

          </div>
        );
      })}

    </div>
  );
}