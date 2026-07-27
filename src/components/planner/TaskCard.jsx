import {
  Clock3,
  MoreHorizontal,
  Circle,
  CheckCircle2,
} from "lucide-react";

import { useState } from "react";
import TaskMenu from "./TaskMenu";

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onStartFocus,
}) {
  const completed = task.completed;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      className={`
        group flex items-center gap-5
        rounded-2xl border
        px-5 py-5
        transition-all
        ${completed
          ? "border-white/[0.04] bg-white/[0.015] opacity-50"
          : "border-white/[0.07] bg-white/[0.025] hover:border-white/[0.12]"
        }
      `}
    >
      {/* Time */}
      <div className="w-20 shrink-0">
        <span className="font-mono text-sm font-semibold text-zinc-500">
          {task.time || "--:--"}
        </span>
      </div>

      {/* Complete Button */}
      <button
        type="button"
        onClick={() => onToggle?.(task)}
        className="shrink-0 text-zinc-500 transition hover:text-emerald-500"
        aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
      >
        {completed ? (
          <CheckCircle2
            size={20}
            className="text-emerald-500"
          />
        ) : (
          <Circle size={20} />
        )}
      </button>

      {/* Task Information */}
      <div className="min-w-0 flex-1">
        <h3
          className={`
            truncate text-sm font-medium
            ${completed
              ? "text-zinc-500 line-through"
              : "text-white"
            }
          `}
        >
          {task.title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          {task.category && (
            <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-500">
              {task.category}
            </span>
          )}

          {task.duration && (
            <span className="flex items-center gap-1 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-500">
              <Clock3 size={12} />
              {task.duration}m
            </span>
          )}

          {task.priority && (
            <span
              className={`
                rounded-full px-2.5 py-1 text-xs capitalize
                ${task.priority === "high"
                  ? "bg-red-500/10 text-red-400"
                  : task.priority === "medium"
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-blue-500/10 text-blue-400"
                }
              `}
            >
              {task.priority}
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu((prev) => !prev)}
          className="
              rounded-lg p-2
              text-zinc-600
              transition
              hover:bg-white/5
              hover:text-white
            "
          aria-label="Task options"
        >
          <MoreHorizontal size={19} />
        </button>

        {showMenu && (
          <TaskMenu
            task={task}
            onStartFocus={(selectedTask) => {
              setShowMenu(false);
              onStartFocus?.(selectedTask);
            }}
            onEdit={(selectedTask) => {
              setShowMenu(false);
              onEdit?.(selectedTask);
            }}
            onDelete={(selectedTask) => {
              setShowMenu(false);
              onDelete?.(selectedTask);
            }}
          />
        )}
      </div>
    </div>
  );
}