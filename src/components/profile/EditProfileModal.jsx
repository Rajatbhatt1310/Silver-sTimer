import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditProfileModal({
  open,
  user,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setUsername(user.username || "");
  }, [user]);

  if (!open || !user) return null;

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !username.trim()) {
      return;
    }

    onSave?.({
      name: name.trim(),
      username: username.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111113] p-6 shadow-2xl">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your profile information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              className="
                w-full rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4 py-3
                text-sm text-white
                outline-none
                focus:border-emerald-500/50
              "
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              className="
                w-full rounded-xl
                border border-white/10
                bg-white/[0.03]
                px-4 py-3
                text-sm text-white
                outline-none
                focus:border-emerald-500/50
              "
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-white/[0.07] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black hover:brightness-110"
            >
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}