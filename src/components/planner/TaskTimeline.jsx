import { Clock3 } from "lucide-react";

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function TaskTimeline({
  selectedDate,
  children,
}) {
  const isToday = isSameDay(
    selectedDate,
    new Date()
  );

  const heading = isToday
    ? "Today's Schedule"
    : selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

  return (
    <section
      className="
        mt-10
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.02]
        p-6
      "
    >
      <div className="flex items-center gap-2">
        <Clock3
          size={18}
          className="text-emerald-500"
        />

        <h2 className="font-semibold text-white">
          {heading}
        </h2>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}