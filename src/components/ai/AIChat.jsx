import AIMessage from "./AIMessage";

export default function AIChat({
  messages = [],
}) {
  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">
      {messages.map((message) => (
        <AIMessage
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
}