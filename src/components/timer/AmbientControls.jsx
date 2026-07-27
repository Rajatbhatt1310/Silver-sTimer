import {
  CloudRain,
  Trees,
  Waves,
  Coffee,
} from "lucide-react";

const SOUNDS = [
  {
    id: "rain",
    icon: CloudRain,
  },
  {
    id: "forest",
    icon: Trees,
  },
  {
    id: "ocean",
    icon: Waves,
  },
  {
    id: "cafe",
    icon: Coffee,
  },
];

export default function AmbientControls({
  activeSound = null,
  onSelect,
}) {
  return (
    <div className="flex justify-center gap-5">
      {SOUNDS.map((sound) => {
        const Icon = sound.icon;

        const active = activeSound === sound.id;

        return (
          <button
            key={sound.id}
            onClick={() => onSelect?.(sound.id)}
            className={[
              "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200",
              active
                ? "bg-[var(--color-primary-dim)] text-[var(--color-primary-light)]"
                : "bg-[var(--color-card)] text-[var(--color-text-muted)] hover:bg-white/5",
            ].join(" ")}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </div>
  );
}