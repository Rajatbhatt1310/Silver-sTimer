import { Bell, Mail } from "lucide-react";

function SettingToggle({
  enabled,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`
        relative h-6 w-11
        rounded-full
        transition
        ${
          enabled
            ? "bg-emerald-500"
            : "bg-white/[0.08]"
        }
      `}
    >
      <span
        className={`
          absolute top-1
          h-4 w-4
          rounded-full
          bg-white
          transition-all
          ${
            enabled
              ? "left-6"
              : "left-1"
          }
        `}
      />
    </button>
  );
}

export default function NotificationSettings({
  emailReminders,
  onEmailRemindersChange,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <Bell size={18} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            Notifications
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Choose how Silver's Timer reminds you
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div className="flex items-center gap-3">
          <Mail
            size={17}
            className="text-zinc-500"
          />

          <div>
            <p className="text-sm font-medium text-zinc-300">
              Planner Email Reminders
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Receive reminders about unfinished planned tasks
            </p>
          </div>
        </div>

        <SettingToggle
          enabled={emailReminders}
          onChange={onEmailRemindersChange}
        />
      </div>
    </div>
  );
}