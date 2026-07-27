import Card from "../ui/Card.jsx";

const TONE_CLASSES = {
  warning: "bg-amber-500/10 text-amber-400",
  xp: "bg-purple-500/10 text-purple-400",
  primary: "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]",
  analytics: "bg-blue-500/10 text-blue-400",
};

export default function AchievementsPreview({
  title = "Recent Achievements",
  achievements = [],
}) {
  return (
    <Card padding="p-5" className="flex flex-col">
      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>

      <ul className="mt-3 flex flex-col gap-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <li key={achievement.id} className="flex items-center gap-3">
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  TONE_CLASSES[achievement.tone ?? "primary"],
                ].join(" ")}
              >
                {Icon && <Icon size={15} strokeWidth={2.25} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-[var(--color-text-primary)]">
                  {achievement.title}
                </span>
                {achievement.subtitle && (
                  <span className="block truncate text-xs text-[var(--color-text-subtle)]">
                    {achievement.subtitle}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
