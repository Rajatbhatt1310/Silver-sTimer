export function generateWeekTimeline(selectedDate = new Date()) {
  const days = [];

  for (let i = -3; i <= 3; i++) {
    const date = new Date(selectedDate);

    date.setDate(selectedDate.getDate() + i);

    days.push({
      fullDate: date,
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),
      isToday:
        date.toDateString() ===
        new Date().toDateString(),
    });
  }

  return days;
}