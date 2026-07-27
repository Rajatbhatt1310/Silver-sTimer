import {
  Pencil,
  Trash2,
  Timer,
} from "lucide-react";

export default function TaskMenu({
  task,
  onEdit,
  onDelete,
  onStartFocus,
}) {
  return (
    <div
      className="
        absolute right-0 top-11 z-20
        w-44
        overflow-hidden
        rounded-xl
        border border-white/10
        bg-[#18181b]
        p-1.5
        shadow-2xl
      "
    >
      <button
        type="button"
        onClick={() => onStartFocus?.(task)}
        className="
          flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-left text-sm text-zinc-300
          transition hover:bg-white/5 hover:text-white
        "
      >
        <Timer size={16} />
        Start Focus
      </button>

      <button
        type="button"
        onClick={() => onEdit?.(task)}
        className="
          flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-left text-sm text-zinc-300
          transition hover:bg-white/5 hover:text-white
        "
      >
        <Pencil size={16} />
        Edit Task
      </button>

      <div className="my-1 border-t border-white/[0.07]" />

      <button
        type="button"
        onClick={() => onDelete?.(task)}
        className="
          flex w-full items-center gap-3
          rounded-lg px-3 py-2.5
          text-left text-sm text-red-400
          transition hover:bg-red-500/10
        "
      >
        <Trash2 size={16} />
        Delete Task
      </button>
    </div>
  );
}