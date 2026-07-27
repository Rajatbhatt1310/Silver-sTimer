const TABS = [
  {
    id: "weekly",
    label: "Weekly",
  },
  {
    id: "monthly",
    label: "Monthly",
  },
  {
    id: "all-time",
    label: "All Time",
  },
];

export default function LeaderboardTabs({
  activeTab,
  onChange,
}) {
  return (
    <div
      className="
        inline-flex
        rounded-xl
        border border-white/[0.07]
        bg-white/[0.025]
        p-1
      "
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`
            rounded-lg
            px-4 py-2
            text-sm font-medium
            transition-all
            ${
              activeTab === tab.id
                ? "bg-emerald-500 text-black"
                : "text-zinc-500 hover:text-white"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}