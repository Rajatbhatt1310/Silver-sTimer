import { Search } from "lucide-react";

export default function TaskSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative flex-1">
      <Search
        size={17}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search tasks..."
        className="
          w-full rounded-xl
          border border-white/[0.07]
          bg-white/[0.025]
          py-2.5 pl-10 pr-4
          text-sm text-white
          outline-none
          placeholder:text-zinc-600
          focus:border-emerald-500/40
        "
      />
    </div>
  );
}