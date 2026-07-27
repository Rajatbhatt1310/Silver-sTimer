import { BarChart3 } from "lucide-react";

export default function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Understand your focus patterns and progress
        </p>
      </div>

      <div
        className="
          flex items-center gap-2
          rounded-xl
          border border-white/[0.07]
          bg-white/[0.025]
          px-4 py-2.5
          text-sm text-zinc-400
        "
      >
        <BarChart3 size={17} />
        Your Progress
      </div>
    </div>
  );
}