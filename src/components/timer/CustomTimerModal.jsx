import { useState } from "react";
import { X } from "lucide-react";

export default function CustomTimerModal({
  open,
  onClose,
  onStart,
}) {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(30);
  const [error, setError] = useState("");

  if (!open) return null;

  function handleStart() {
    const safeHours = Number(hours) || 0;
    const safeMinutes = Number(minutes) || 0;

    if (
      safeHours < 0 ||
      safeHours > 24 ||
      safeMinutes < 0 ||
      safeMinutes > 59
    ) {
      setError("Enter a valid time.");
      return;
    }

    const totalMinutes =
      safeHours * 60 + safeMinutes;

    if (totalMinutes <= 0) {
      setError("Session must be at least 1 minute.");
      return;
    }

    // Absolute maximum = exactly 24 hours
    if (totalMinutes > 24 * 60) {
      setError("Maximum session is 24 hours.");
      return;
    }

    setError("");

    onStart(totalMinutes);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-8">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Custom Session
          </h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-6">

          <div>
            <label className="mb-2 block text-sm">
              Hours
            </label>

            <input
              type="number"
              min={0}
              max={24}
              value={hours}
              onChange={(e) => {
                setHours(Number(e.target.value));
                setError("");
              }}
              className="w-full rounded-xl bg-black/20 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Minutes
            </label>

            <input
              type="number"
              min={0}
              max={59}
              value={minutes}
              onChange={(e) => {
                setMinutes(Number(e.target.value));
                setError("");
              }}
              className="w-full rounded-xl bg-black/20 p-3"
            />
          </div>

          <p className="text-xs text-zinc-500">
            Maximum session: 24 hours
          </p>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={handleStart}
            className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-black"
          >
            Start Session
          </button>

        </div>

      </div>
    </div>
  );
}