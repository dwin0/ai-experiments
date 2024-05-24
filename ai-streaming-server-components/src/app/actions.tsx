"use server";

import { openai } from "@ai-sdk/openai";
import { nanoid } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { ReactNode } from "react";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// https://sdk.vercel.ai/docs/ai-sdk-rsc/ai-ui-states#ai-state
// It contains the context the language model needs to read
// can be accessed on client and server
// in this example: server actions reads from and writes into AI State
export interface AIStateMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
}

// https://sdk.vercel.ai/docs/ai-sdk-rsc/ai-ui-states#ui-state
// can only be accessed on client (managed on client always)
export interface UIStateMessage {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
}

// Input: string message from client
// Output: Message that client can use to update UIState
export async function sendMessage(input: string): Promise<UIStateMessage> {
  // Get a mutable copy of the AI state. You can use this to update the state in the server.
  const history = getMutableAIState();

  console.log(history.get());

  const result = await streamUI({
    // "Fast, inexpensive model for simple tasks"
    model: openai("gpt-3.5-turbo"),

    system: "You are a helpful assistant",

    // Does not update AI state
    // chatGPT needs a list of all previous messages and the most recent input from the user
    messages: [...history.get(), { role: "user", content: input }],

    text: ({ content, done }) => {
      // Whether the model is done generating text.
      if (done) {
        // Updates the AI state with user input and model response
        // Marks it as finalized and closes the stream.
        history.done((messages: AIStateMessage[]) => {
          return [
            ...messages,
            { role: "user", content: input },
            // model response
            { role: "assistant", content },
          ];
        });

        return <div>{content}</div>;
      }
    },

    // As soon as tools are involved, it seems that no other calls are made
    // https://github.com/vercel/ai/blob/ccaf43dcaeeccb427a97901e63ff3ea909a708c5/packages/openai/src/openai-chat-language-model.ts#L125
    tools: {
      getCurrentWeather: {
        description: "Get the current weather",
        parameters: z.object({
          location: z.string().describe("the users location"),
        }),
        generate: async function* ({ location }) {
          yield <div>Loading weather for {location}...</div>;

          history.done((messages: AIStateMessage[]) => [
            ...messages,
            { role: "user", content: input },
            // Tool seems to cause a problem: https://github.com/vercel/ai/blob/ccaf43dcaeeccb427a97901e63ff3ea909a708c5/packages/openai/src/convert-to-openai-chat-messages.ts#L5
            // {
            //   role: "tool",
            //   content: [
            //     {
            //       type: "tool-result",
            //       toolCaltoolCallId: nanoid(),
            //       toolName: "getCurrentWeather",
            //       result: JSON.stringify({ weather: "sunny" }),
            //     },
            //   ],
            // },
          ]);

          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(<p>The weather is sunny</p>);
            }, 1000);
          });
        },
      },
    },
  });

  return {
    id: nanoid(),
    role: "assistant",
    display: result.value,
  };
}

export const AI = createAI<AIStateMessage[], UIStateMessage[]>({
  actions: {
    sendMessage,
  },
  initialAIState: [],
  initialUIState: [
    {
      id: "0",
      role: "assistant",
      display: <p>Hey! How can I help you today?</p>,
    },
  ],
  // onGetA: async () => {
  //   "use server";

  //   const history: AIStateMessage[] = getAIState();

  //   return history.map(({ role, content }) => ({
  //     id: nanoid(),
  //     role,
  //     display: role === "tool" ? <pre>{...JSON.parse(content)}</pre> : content,
  //   }));
  // },
});

export type AI = typeof AI;
