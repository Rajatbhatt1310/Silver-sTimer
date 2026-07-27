import { Clock3, TimerReset, Timer, Zap } from "lucide-react";

const MODES = [
  {
    id: "pomodoro",
    label: "Pomodoro",
    icon: Clock3,
  },
  {
    id: "deep-work",
    label: "Deep Work",
    icon: Zap,
  },
  {
    id: "stopwatch",
    label: "Stopwatch",
    icon: Timer,
  },
  {
    id: "custom",
    label: "Custom",
    icon: TimerReset,
  },
];

export default function TimerModes({
  activeMode = "deep-work",
  onModeChange,
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      {MODES.map((mode) => {
        const Icon = mode.icon;

        const active = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onModeChange?.(mode.id)}
            className={[
              "flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200",
              active
                ? "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]"
                : "bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-white/5",
            ].join(" ")}
          >
            <Icon size={17} />

            <span className="text-sm font-medium">
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}