import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Card from "../ui/Card.jsx";
import Button from "../ui/Button.jsx";

export default function AIInsightCard({
  title = "AI Insight",
  message,
  suggestedSessionLabel,
  suggestedSessionDuration,
  onOpenChat,
  className = "",
}) {
  return (
    <Card padding="p-6" className={["flex flex-col", className].join(" ")}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary-dim)]">
          <Sparkles size={14} strokeWidth={2.25} className="text-[var(--color-primary-light)]" />
        </span>
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-primary)]/90">
        {message}
      </p>

      {suggestedSessionLabel && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-medium text-[var(--color-text-subtle)]">
            Suggested next session
          </p>
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-white/[0.03] px-3.5 py-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-dim)]">
              <BookOpen size={12} strokeWidth={2.25} className="text-[var(--color-primary-light)]" />
            </span>
            <span className="text-sm text-[var(--color-text-primary)]">
              {suggestedSessionLabel}
              {suggestedSessionDuration && (
                <span className="text-[var(--color-text-muted)]"> · {suggestedSessionDuration}</span>
              )}
            </span>
          </div>
        </div>
      )}

      <Button
        variant="primary"
        size="md"
        icon={ArrowRight}
        iconPosition="right"
        onClick={onOpenChat}
        className="mt-5 w-full justify-center"
      >
        Open AI Chat
      </Button>
    </Card>
  );
}
