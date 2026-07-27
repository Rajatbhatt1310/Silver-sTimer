import { useState } from "react";

import AIHeader from "../components/ai/AIHeader";
import AIWelcome from "../components/ai/AIWelcome";
import AIChat from "../components/ai/AIChat";
import AIInput from "../components/ai/AIInput";

export default function AI() {
  const [messages] = useState([]);

  function handleSend(message) {
    console.log("Send to AI API:", message);
  }

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col px-8 py-10">

      <AIHeader />

      <div
        className="
          mt-8
          flex min-h-0 flex-1 flex-col
          overflow-hidden
          rounded-2xl
          border border-white/[0.07]
          bg-white/[0.015]
        "
      >
        {messages.length === 0 ? (
          <AIWelcome
            onSuggestion={handleSend}
          />
        ) : (
          <AIChat
            messages={messages}
          />
        )}

        <AIInput
          onSend={handleSend}
        />
      </div>

    </div>
  );
}