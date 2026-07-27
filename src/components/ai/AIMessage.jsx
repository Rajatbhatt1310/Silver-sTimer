import { Bot } from "lucide-react";

export default function AIMessage({
  message,
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={`
        flex
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          flex max-w-[75%] gap-3
          ${isUser ? "flex-row-reverse" : ""}
        `}
      >
        {!isUser && (
          <div
            className="
              flex h-8 w-8
              shrink-0 items-center justify-center
              rounded-lg
              bg-emerald-500/10
              text-emerald-400
            "
          >
            <Bot size={16} />
          </div>
        )}

        <div
          className={`
            rounded-2xl px-4 py-3
            text-sm leading-6
            ${
              isUser
                ? "bg-emerald-500 text-black"
                : "border border-white/[0.07] bg-white/[0.03] text-zinc-300"
            }
          `}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}