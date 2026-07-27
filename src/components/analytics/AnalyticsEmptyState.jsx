import { ChartNoAxesCombined } from "lucide-react";

export default function AnalyticsEmptyState() {
  return (
    <div
      className="
        mt-8
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
          bg-emerald-500/10
          text-emerald-400
        "
      >
        <ChartNoAxesCombined size={25} />
      </div>

      <h2 className="mt-5 text-base font-semibold text-white">
        Your analytics will appear here
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        Complete focus sessions to start building your productivity insights.
      </p>
    </div>
  );
}