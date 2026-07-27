import {
  AlertTriangle,
  Loader2,
} from "lucide-react";


export default function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!open) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl">


        {/* Icon */}

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">

          <AlertTriangle
            size={21}
          />

        </div>


        {/* Content */}

        <h2 className="mt-5 text-lg font-semibold text-white">
          Delete your account?
        </h2>


        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Your account and associated data will be
          permanently deleted. This action cannot be
          undone.
        </p>


        {/* Actions */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl
              border border-white/10
              px-4 py-2.5
              text-sm text-zinc-300
              transition
              hover:bg-white/5
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="
              flex items-center gap-2
              rounded-xl
              bg-red-500
              px-4 py-2.5
              text-sm font-semibold text-white
              transition
              hover:bg-red-600
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {loading && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}


            {loading
              ? "Deleting..."
              : "Delete Account"}

          </button>

        </div>

      </div>

    </div>
  );
}