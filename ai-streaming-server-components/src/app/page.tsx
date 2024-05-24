"use client";

import { useState } from "react";
import { UIStateMessage, type AI } from "@/app/actions";
import { useActions, useUIState } from "ai/rsc";
import { nanoid } from "ai";

export default function Home() {
  const [input, setInput] = useState<string>("");

  // can contain functions, React nodes, and other data
  // can only be accessed on client
  const [conversation, setConversation] = useUIState();

  // It is required to access these server actions via this hook because they are patched when passed through the context.
  const { sendMessage } = useActions<AI>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {conversation.map((message: UIStateMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Updates UI state with user input
          setInput("");
          setConversation((currentConversation: UIStateMessage[]) => [
            ...currentConversation,
            { id: nanoid(), role: "user", display: input },
          ]);

          const message = await sendMessage(input);

          setConversation((currentConversation: UIStateMessage[]) => [
            ...currentConversation,
            message,
          ]);
        }}
      >
        <label htmlFor="chat-input">Enter your message:</label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />

        <button type="submit">Send message</button>
      </form>
    </main>
  );
}
