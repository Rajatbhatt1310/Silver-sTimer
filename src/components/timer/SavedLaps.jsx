import { Flag } from "lucide-react";

function formatLapTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return [
      hours,
      minutes,
      seconds,
    ]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  return [minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function SavedLaps({
  laps = [],
}) {
  if (laps.length === 0) return null;

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center gap-2">
        <Flag
          size={16}
          className="text-emerald-400"
        />

        <h3 className="text-sm font-semibold text-white">
          Saved Laps
        </h3>
      </div>

      <div className="flex max-h-48 flex-col gap-2 overflow-y-auto">
        {[...laps].reverse().map((lap) => (
          <div
            key={lap.id}
            className="flex items-center justify-between rounded-xl bg-white/[0.025] px-4 py-3"
          >
            <span className="text-sm text-zinc-500">
              Lap {lap.number}
            </span>

            <span className="font-mono text-sm font-medium text-white">
              {formatLapTime(lap.time)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}