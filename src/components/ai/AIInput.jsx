import { useState } from "react";
import { Send } from "lucide-react";

export default function AIInput({
  initialValue = "",
  onSend,
  disabled = false,
}) {
  const [message, setMessage] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();

    const value = message.trim();

    if (!value || disabled) return;

    onSend?.(value);

    setMessage("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex items-end gap-3
        border-t border-white/[0.07]
        p-4
      "
    >
      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        placeholder="Ask your AI assistant..."
        rows={1}
        className="
          max-h-32 min-h-12
          flex-1 resize-none
          rounded-xl
          border border-white/[0.07]
          bg-white/[0.025]
          px-4 py-3
          text-sm text-white
          outline-none
          placeholder:text-zinc-600
          focus:border-emerald-500/40
        "
      />

      <button
        type="submit"
        disabled={disabled}
        className="
          flex h-12 w-12
          items-center justify-center
          rounded-xl
          bg-emerald-500
          text-black
          transition
          hover:brightness-110
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        <Send size={18} />
      </button>
    </form>
  );
}