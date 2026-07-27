import { useState } from "react";
import { X } from "lucide-react";

export default function AddTaskModal({
  open,
  onClose,
  selectedDate,
  onCreate,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [duration, setDuration] = useState(30);

  if (!open) return null;

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    const task = {
      title: title.trim(),
      description: description.trim(),
      date: selectedDate,
      time,
      category,
      priority,
      duration: Number(duration),
    };

    onCreate?.(task);

    setTitle("");
    setDescription("");
    setTime("");
    setCategory("");
    setPriority("medium");
    setDuration(30);

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              New Task
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a task to your planner
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What do you want to work on?"
              className="
                w-full rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4 py-3
                text-sm text-white
                outline-none
                placeholder:text-zinc-600
                focus:border-emerald-500/50
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add details..."
              rows={3}
              className="
                w-full resize-none rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4 py-3
                text-sm text-white
                outline-none
                placeholder:text-zinc-600
                focus:border-emerald-500/50
              "
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Start Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  focus:border-emerald-500/50
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Focus Duration
              </label>

              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-[#18181b]
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  focus:border-emerald-500/50
                "
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="e.g. Physics"
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-white/[0.03]
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  placeholder:text-zinc-600
                  focus:border-emerald-500/50
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Priority
              </label>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="
                  w-full rounded-xl
                  border border-white/10
                  bg-[#18181b]
                  px-4 py-3
                  text-sm text-white
                  outline-none
                  focus:border-emerald-500/50
                "
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
            >
              Create Task
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}