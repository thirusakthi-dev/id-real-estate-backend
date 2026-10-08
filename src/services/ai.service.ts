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

    console.log("================================");
    console.log("AI REQUEST:", userMessage);
    console.log("================================");

    /* ---------------------------------------------------------------------- */
    /* First Groq request                                                     */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Normal response                                                        */
    /* ---------------------------------------------------------------------- */

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

    /* ---------------------------------------------------------------------- */
    /* Tool call                                                              */
    /* ---------------------------------------------------------------------- */

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
    } catch {
      console.error("Invalid tool arguments:", toolCall.function.arguments);

      return {
        type: "text",
        message:
          "I couldn't understand the property requirements. Please try again.",
      };
    }

    console.log("AI FUNCTION:", functionName);
    console.log("AI RAW FUNCTION ARGS:", functionArguments);

    /* ---------------------------------------------------------------------- */
    /* Execute tool                                                           */
    /* ---------------------------------------------------------------------- */

    let toolResult: unknown;

    let sanitizedFilters: AiPropertyFilters | undefined;

    if (functionName === "countProperties") {
      sanitizedFilters = sanitizeAiFilters(functionArguments);

      console.log("AI SANITIZED FILTERS:", sanitizedFilters);

      toolResult = await countProperties(sanitizedFilters);
    } else if (functionName === "searchProperties") {
      sanitizedFilters = sanitizeAiFilters(functionArguments);

      console.log("AI SANITIZED FILTERS:", sanitizedFilters);

      toolResult = await searchProperties(sanitizedFilters);
    } else if (functionName === "getProperty") {
      const propertyId = Number(functionArguments.id);

      if (!Number.isInteger(propertyId) || propertyId <= 0) {
        return {
          type: "text",
          message: "I couldn't identify that property.",
        };
      }

      toolResult = await getProperty(propertyId);
    } else {
      console.error("Unknown AI function:", functionName);

      return {
        type: "text",
        message: "I couldn't process that property request.",
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Tool result                                                            */
    /* ---------------------------------------------------------------------- */

    const finalMessages = [
      ...messages,

      assistantMessage,

      {
        role: "tool" as const,

        tool_call_id: toolCall.id,

        content: JSON.stringify(toolResult),
      },
    ];

    /* ---------------------------------------------------------------------- */
    /* Second Groq request                                                    */
    /* ---------------------------------------------------------------------- */

    const finalResponse = await groq.chat.completions.create({
      model: MODEL,

      messages: finalMessages,

      temperature: 0.2,

      max_completion_tokens: 500,
    });

    const finalMessage = finalResponse.choices[0]?.message?.content?.trim();

    const message = finalMessage || "Here are the matching properties.";

    /* ---------------------------------------------------------------------- */
    /* Count response                                                         */
    /* ---------------------------------------------------------------------- */

    if (functionName === "countProperties") {
      const result = toolResult as {
        count: number;
        filters: AiPropertyFilters;
      };

      return {
        type: "count",

        message,

        count: result.count,

        filters: sanitizedFilters ?? result.filters,
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Properties response                                                    */
    /* ---------------------------------------------------------------------- */

    if (functionName === "searchProperties") {
      const result = toolResult as Awaited<ReturnType<typeof searchProperties>>;

      return {
        type: "properties",

        message,

        properties: result,

        filters: sanitizedFilters ?? {},
      };
    }

    /* ---------------------------------------------------------------------- */
    /* Single property response                                               */
    /* ---------------------------------------------------------------------- */

    if (functionName === "getProperty") {
      return {
        type: "property",

        message,

        property: toolResult as Awaited<ReturnType<typeof getProperty>>,
      };
    }

    return {
      type: "text",

      message,
    };
  } catch (error) {
    console.error("======================================");

    console.error("AI SERVICE ERROR");

    console.error(error);

    console.error("======================================");

    throw error;
  }
};
