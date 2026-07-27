import { Trash2 } from "lucide-react";

export default function DangerZone({
  onDeleteAccount,
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6">
      <h2 className="font-semibold text-red-400">
        Danger Zone
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Irreversible account actions
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-red-500/10 pt-5">
        <div>
          <p className="text-sm font-medium text-zinc-300">
            Delete Account
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Permanently delete your account and associated data
          </p>
        </div>

        <button
          type="button"
          onClick={onDeleteAccount}
          className="
            flex items-center gap-2
            rounded-xl
            border border-red-500/20
            bg-red-500/10
            px-4 py-2.5
            text-sm font-medium
            text-red-400
            transition
            hover:bg-red-500/20
          "
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      </div>
    </div>
  );
}