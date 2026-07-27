import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function TaskFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <SlidersHorizontal
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <select
          value={filter}
          onChange={(event) =>
            onFilterChange(event.target.value)
          }
          className="
            rounded-xl
            border border-white/[0.07]
            bg-[#18181b]
            py-2.5 pl-9 pr-8
            text-sm text-zinc-300
            outline-none
          "
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="relative">
        <ArrowUpDown
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value)
          }
          className="
            rounded-xl
            border border-white/[0.07]
            bg-[#18181b]
            py-2.5 pl-9 pr-8
            text-sm text-zinc-300
            outline-none
          "
        >
          <option value="time">Time</option>
          <option value="priority">Priority</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alphabetical">A–Z</option>
        </select>
      </div>
    </div>
  );
}