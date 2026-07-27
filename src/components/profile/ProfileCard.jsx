import { Pencil } from "lucide-react";

export default function ProfileCard({
  user,
  onEdit,
}) {
  if (!user) return null;

  const initial =
    user.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
      <div className="flex items-center gap-5">

        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-emerald-500/10">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-emerald-400">
              {initial}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-semibold text-white">
            {user.name}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            @{user.username}
          </p>

          <p className="mt-1 text-sm text-zinc-600">
            {user.email}
          </p>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="
            flex items-center gap-2
            rounded-xl
            border border-white/[0.08]
            px-4 py-2.5
            text-sm text-zinc-300
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <Pencil size={16} />
          Edit Profile
        </button>

      </div>
    </div>
  );
}