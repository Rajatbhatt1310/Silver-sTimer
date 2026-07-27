import { Plus } from "lucide-react";

export default function PlannerHeader({ onNewTask }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Weekly Planner
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Organize your study sessions
        </p>
      </div>

      <button
        type="button"
        onClick={onNewTask}
        className="
          flex items-center gap-2
          rounded-xl
          bg-emerald-500
          px-5 py-2.5
          text-sm font-semibold
          text-black
          transition-all
          hover:brightness-110
        "
      >
        <Plus size={18} />
        New Task
      </button>
    </div>
  );
}