import { CalendarPlus } from "lucide-react";

export default function EmptyPlanner({
  onAddTask,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
        <CalendarPlus size={22} />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        Nothing planned for this day
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
        Add a task and start planning your focus sessions.
      </p>

      <button
        type="button"
        onClick={onAddTask}
        className="mt-5 text-sm font-medium text-emerald-400 transition hover:text-emerald-300"
      >
        + Add your first task
      </button>
    </div>
  );
}