import { Sparkles } from "lucide-react";

export default function AIHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          AI Assistant
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Get quick help while you study and stay focused
        </p>
      </div>

      <div
        className="
          flex items-center gap-2
          rounded-xl
          border border-emerald-500/20
          bg-emerald-500/[0.06]
          px-4 py-2.5
          text-sm text-emerald-400
        "
      >
        <Sparkles size={17} />
        AI Powered
      </div>
    </div>
  );
}