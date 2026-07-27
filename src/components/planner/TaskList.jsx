import TaskCard from "./TaskCard";
import EmptyPlanner from "./EmptyPlanner";

export default function TaskList({
  tasks = [],
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onStartFocus,
  onAddTask,
}) {
  if (tasks.length === 0) {
    return (
      <EmptyPlanner
        onAddTask={onAddTask}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggleTask}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStartFocus={onStartFocus}
        />
      ))}
    </div>
  );
}