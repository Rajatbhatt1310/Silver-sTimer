import { Plus, Check, Clock } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";

function TaskRow({ task, onToggle }) {
  return (
    <li className="flex items-center gap-3 py-2.5">
      <button
        type="button"
        onClick={() => onToggle?.(task.id)}
        aria-label={task.done ? "Mark task incomplete" : "Mark task complete"}
        className={[
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
          task.done
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[#06170d]"
            : "border-[var(--color-border-strong)] text-transparent hover:border-[var(--color-primary)]",
        ].join(" ")}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      <span className="min-w-0 flex-1">
        <span
          className={[
            "block truncate text-sm",
            task.done
              ? "text-[var(--color-text-subtle)] line-through"
              : "text-[var(--color-text-primary)]",
          ].join(" ")}
        >
          {task.title}
        </span>
      </span>

      {task.subject && (
        <Badge tone="default" className="hidden sm:inline-flex">
          {task.subject}
        </Badge>
      )}

      {task.duration && (
        <span className="flex items-center gap-1 text-xs text-[var(--color-text-subtle)]">
          <Clock size={11} strokeWidth={2.25} />
          {task.duration}
        </span>
      )}
    </li>
  );
}

export default function TaskPreviewCard({ title = "Today's Tasks", tasks = [], onAddTask, onToggleTask }) {
  return (
    <Card padding="p-5" className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary-light)] hover:text-[var(--color-primary)] transition-colors duration-150"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add
        </button>
      </div>

      <ul className="mt-1 divide-y divide-[var(--color-border)]">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onToggle={onToggleTask} />
        ))}
      </ul>
    </Card>
  );
}
