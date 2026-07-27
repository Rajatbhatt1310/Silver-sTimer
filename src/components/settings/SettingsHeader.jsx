import { Settings } from "lucide-react";

export default function SettingsHeader() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-400">
          <Settings size={19} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Manage your account and preferences
          </p>
        </div>
      </div>
    </div>
  );
}