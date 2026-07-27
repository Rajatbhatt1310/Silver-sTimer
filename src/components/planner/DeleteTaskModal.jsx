import { AlertTriangle } from "lucide-react";

export default function DeleteTaskModal({
  open,
  task,
  onClose,
  onConfirm,
}) {
  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
          <AlertTriangle size={21} />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-white">
          Delete Task?
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Are you sure you want to delete{" "}
          <span className="font-medium text-zinc-200">
            {task.title}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm?.(task)}
            className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}