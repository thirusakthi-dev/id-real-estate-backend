import { groq } from "../lib/groq.js";

import { AI_SYSTEM_INSTRUCTION } from "../ai/ai-prompt.js";
import { aiTools } from "../ai/ai-tools.js";

import {
  countProperties,
  searchProperties,
  getProperty,
} from "../ai/ai-properties.js";

import { sanitizeAiFilters } from "../ai/ai-sanitize.js";

import type {
  AiChatMessage,
  AiPropertyFilters,
  AiResponse,
} from "../ai/ai-types.js";

const MODEL = "openai/gpt-oss-20b";

const CHAT_HISTORY_LIMIT = 10;

const FINAL_RESPONSE_INSTRUCTION = `
You are generating the final response for a real-estate application.

Use ONLY the property data returned by the database tool.

Never invent:
- properties
- property IDs
- prices
- locations
- owners
- availability
- bedrooms
- bathrooms
- area
- counts

Do not add information that is not present in the tool result.

Keep the response concise.

Do not create Markdown tables.

The frontend will render property cards separately.

If properties were returned, briefly tell the user that matching properties
were found.

If no properties were returned, clearly say that no matching properties were
found.

If a count was returned, use exactly that count.

Do not mention tools, databases, Prisma, Groq, APIs, function calls, or
internal implementation.
`;

export const generateAiResponse = async (
  userMessage: string,
  history: AiChatMessage[] = [],
): Promise<AiResponse> => {
  try {
    const limitedHistory = history.slice(-CHAT_HISTORY_LIMIT);

    const messages = [
      {
        role: "system" as const,
        content: AI_SYSTEM_INSTRUCTION,
      },

      ...limitedHistory.map((item) => ({
        role:
          item.role === "assistant"
            ? ("assistant" as const)
            : ("user" as const),

        content: item.message,
      })),

      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    const response = await groq.chat.completions.create({
      model: MODEL,

      messages,

      tools: aiTools,

      tool_choice: "auto",

      parallel_tool_calls: false,

      temperature: 0.2,

      max_completion_tokens: 1000,
    });

    const assistantMessage = response.choices[0]?.message;

    if (!assistantMessage) {
      return {
        type: "text",
        message: "I couldn't generate a response. Please try again.",
      };
    }

    /*
     * No tool call means the AI is asking a clarification question,
     * handling a greeting, or rejecting an unrelated request.
     */
    if (
      !assistantMessage.tool_calls ||
      assistantMessage.tool_calls.length === 0
    ) {
      return {
        type: "text",
        message:
          assistantMessage.content?.trim() ||
          "How can I help you find a property?",
      };
    }

    const toolCall = assistantMessage.tool_calls[0];

    const functionName = toolCall.function.name;

    let functionArguments: Record<string, unknown> = {};

    try {
      const parsedArguments = JSON.parse(toolCall.function.arguments || "{}");

      if (
        !parsedArguments ||
        typeof parsedArguments !== "object" ||
        Array.isArray(parsedArguments)
      ) {
        console.error("Invalid AI tool arguments:", parsedArguments);

        return {
          type: "text",
          message:
            "I couldn't understand the property requirements. Please try again.",
        };
      }

      functionArguments = parsedArguments as Record<string, unknown>;
    } catch (error) {
      console.error("Invalid AI tool arguments:", error);

      return {
        type: "text",
        message:
          "I couldn't understand the property requirements. Please try again.",
      };
    }

    let toolResult: unknown;

    let sanitizedFilters: AiPropertyFilters | undefined;

    /*
     * COUNT PROPERTIES
     */
    if (functionName === "countProperties") {
      sanitizedFilters = sanitizeAiFilters(functionArguments);

      toolResult = await countProperties(sanitizedFilters);
    } else if (functionName === "searchProperties") {

    /*
     * SEARCH PROPERTIES
     */
      sanitizedFilters = sanitizeAiFilters(functionArguments);

      toolResult = await searchProperties(sanitizedFilters);
    } else if (functionName === "getProperty") {

    /*
     * GET PROPERTY
     */
      const propertyId = Number(functionArguments.id);

      if (!Number.isInteger(propertyId) || propertyId <= 0) {
        return {
          type: "text",
          message: "I couldn't identify that property.",
        };
      }

      toolResult = await getProperty(propertyId);
    } else {

    /*
     * UNKNOWN TOOL
     */
      console.error("Unknown AI function:", functionName);

      return {
        type: "text",
        message: "I couldn't process that property request.",
      };
    }

    /*
     * COUNT RESULT
     *
     * No need for another AI request when the answer is simply a count.
     * This also guarantees that the count cannot be hallucinated.
     */
    if (functionName === "countProperties") {
      const result = toolResult as {
        count: number;
        filters: AiPropertyFilters;
      };

      let message: string;

      if (result.count === 0) {
        message = "I couldn't find any properties matching those requirements.";
      } else {
        message = `I found **${result.count}** matching ${
          result.count === 1 ? "property" : "properties"
        }.`;
      }

      return {
        type: "count",
        message,
        count: result.count,
        filters: sanitizedFilters ?? result.filters,
      };
    }

    /*
     * SEARCH RESULT
     */
    if (functionName === "searchProperties") {
      const result = toolResult as Awaited<ReturnType<typeof searchProperties>>;

      if (result.length === 0) {
        return {
          type: "properties",
          message:
            "I couldn't find any properties matching those requirements.",
          properties: [],
          filters: sanitizedFilters ?? {},
        };
      }

      /*
       * Let Groq generate a short natural-language response,
       * but give it ONLY the database result.
       */
      const finalMessages = [
        {
          role: "system" as const,
          content: FINAL_RESPONSE_INSTRUCTION,
        },

        {
          role: "user" as const,
          content: JSON.stringify({
            type: "properties",
            filters: sanitizedFilters ?? {},
            properties: result,
          }),
        },
      ];

      const finalResponse = await groq.chat.completions.create({
        model: MODEL,

        messages: finalMessages,

        temperature: 0.1,

        max_completion_tokens: 200,
      });

      const finalMessage = finalResponse.choices[0]?.message?.content?.trim();

      return {
        type: "properties",

        message:
          finalMessage ||
          `I found ${result.length} matching ${
            result.length === 1 ? "property" : "properties"
          }.`,

        properties: result,

        filters: sanitizedFilters ?? {},
      };
    }

    /*
     * SINGLE PROPERTY
     */
    if (functionName === "getProperty") {
      const property = toolResult as Awaited<ReturnType<typeof getProperty>>;

      if (!property) {
        return {
          type: "property",
          message: "I couldn't find that property.",
          property: null,
        };
      }

      return {
        type: "property",

        message: "Here are the details of the property.",

        property,
      };
    }

    return {
      type: "text",

      message: "I couldn't process that property request.",
    };
  } catch (error) {
    console.error("======================================");
    console.error("AI SERVICE ERROR");
    console.error(error);
    console.error("======================================");

    throw error;
  }
};
