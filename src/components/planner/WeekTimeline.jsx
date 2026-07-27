import { generateWeekTimeline } from "../../utils/weekTimeline";

export default function WeekTimeline({
  selectedDate,
  onSelectDate,
}) {
  const days = generateWeekTimeline(selectedDate);

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day) => {
        const selected =
          day.fullDate.toDateString() ===
          selectedDate.toDateString();

        return (
          <button
            key={day.fullDate}
            onClick={() => onSelectDate(day.fullDate)}
            className={`
              rounded-3xl
              border
              p-5
              transition-all
              ${
                selected
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
              }
            `}
          >
            <p className="text-sm text-zinc-400">
              {day.day}
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {day.date}
            </p>

            {day.isToday && (
              <span className="mt-3 inline-block rounded-full bg-emerald-500 px-2 py-1 text-xs text-black">
                Today
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}