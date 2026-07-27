import { Target } from "lucide-react";
import ProgressBar from "../ui/ProgressBar.jsx";

export default function GoalWidget({ label = "Today's Goal", targetLabel, progressText, percent }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary-dim)]">
        <Target size={16} strokeWidth={2.25} className="text-[var(--color-primary-light)]" />
      </span>
      <div className="min-w-[150px]">
        <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">
          {targetLabel}
          {progressText && (
            <span className="text-[var(--color-text-muted)] font-normal"> · {progressText}</span>
          )}
        </p>
        <div className="mt-1.5">
          <ProgressBar value={percent} tone="primary" />
        </div>
      </div>
    </div>
  );
}
