import { LockKeyhole } from "lucide-react";

export default function AccountSettings({
  onChangePassword,
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-400">
          <LockKeyhole size={18} />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            Account Security
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Manage your password and account security
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div>
          <p className="text-sm font-medium text-zinc-300">
            Password
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Change your account password
          </p>
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className="
            rounded-xl
            border border-white/[0.08]
            px-4 py-2.5
            text-sm text-zinc-300
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          Change Password
        </button>
      </div>
    </div>
  );
}