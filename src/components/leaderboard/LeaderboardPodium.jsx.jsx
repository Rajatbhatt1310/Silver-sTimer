import { Crown } from "lucide-react";

function PodiumUser({
  user,
  position,
}) {
  if (!user) return null;

  const isFirst = position === 1;

  return (
    <div
      className={`
        flex flex-col items-center
        ${isFirst ? "-translate-y-6" : ""}
      `}
    >
      {isFirst && (
        <Crown
          size={22}
          className="mb-2 text-amber-400"
        />
      )}

      <div
        className={`
          flex items-center justify-center
          overflow-hidden rounded-full
          border
          ${
            position === 1
              ? "h-20 w-20 border-amber-400/40"
              : "h-16 w-16 border-white/10"
          }
          bg-white/[0.05]
        `}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={`
              font-bold text-zinc-300
              ${isFirst ? "text-xl" : "text-base"}
            `}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </span>
        )}
      </div>

      <span
        className={`
          mt-3 flex h-7 w-7
          items-center justify-center
          rounded-full text-xs font-bold
          ${
            position === 1
              ? "bg-amber-500/15 text-amber-400"
              : position === 2
              ? "bg-zinc-400/10 text-zinc-300"
              : "bg-orange-500/10 text-orange-400"
          }
        `}
      >
        {position}
      </span>

      <p className="mt-2 max-w-32 truncate text-sm font-semibold text-white">
        {user.name}
      </p>

      <p className="mt-1 text-xs text-zinc-500">
        {user.xp?.toLocaleString()} XP
      </p>
    </div>
  );
}

export default function LeaderboardPodium({
  users = [],
}) {
  if (users.length < 3) return null;

  return (
    <div
      className="
        grid grid-cols-3
        items-end
        rounded-2xl
        border border-white/[0.07]
        bg-white/[0.02]
        px-10 pb-8 pt-16
      "
    >
      <PodiumUser
        user={users[1]}
        position={2}
      />

      <PodiumUser
        user={users[0]}
        position={1}
      />

      <PodiumUser
        user={users[2]}
        position={3}
      />
    </div>
  );
}