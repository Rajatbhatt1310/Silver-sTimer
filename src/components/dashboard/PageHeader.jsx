export default function PageHeader({ date, greetingName, streakDays, wave = true }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-[var(--color-text-muted)]">{date}</span>
      <h1 className="text-[26px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
        Good afternoon, {greetingName} {wave && <span aria-hidden>👋</span>}
      </h1>
      {typeof streakDays === "number" && (
        <p className="text-sm text-[var(--color-text-muted)]">
          You're on a{" "}
          <span className="font-semibold text-[var(--color-warning)]">
            {streakDays}-day streak
          </span>
          . Keep it up!
        </p>
      )}
    </div>
  );
}
