import {
  Brain,
  Lightbulb,
  Target,
  Timer,
} from "lucide-react";

const SUGGESTIONS = [
  {
    id: "explain",
    icon: Brain,
    label: "Explain a concept",
    prompt: "Can you explain ",
  },
  {
    id: "focus",
    icon: Target,
    label: "Help me focus",
    prompt: "Help me plan a focused study session for ",
  },
  {
    id: "study",
    icon: Lightbulb,
    label: "Study advice",
    prompt: "Give me advice for studying ",
  },
  {
    id: "session",
    icon: Timer,
    label: "Plan a session",
    prompt: "Create a focus session plan for ",
  },
];

export default function AIWelcome({
  onSuggestion,
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

      <div
        className="
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-emerald-500/10
          text-emerald-400
        "
      >
        <Brain size={26} />
      </div>

      <h2 className="mt-5 text-xl font-semibold text-white">
        How can I help you focus?
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
        Ask a quick question, understand a concept, or get help planning your next focus session.
      </p>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-2 gap-3">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onSuggestion?.(item.prompt)
              }
              className="
                flex items-center gap-3
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.02]
                p-4
                text-left
                transition
                hover:border-white/[0.12]
                hover:bg-white/[0.04]
              "
            >
              <Icon
                size={18}
                className="text-emerald-400"
              />

              <span className="text-sm text-zinc-300">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}