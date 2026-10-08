import { groq } from "../lib/groq.js";
import { prisma } from "../lib/prisma.js";

import {
  buildPropertyFilters,
  type PropertyFilters,
} from "../utils/property.filters.js";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const MODEL = "openai/gpt-oss-20b";

const CHAT_HISTORY_LIMIT = 10;

/* -------------------------------------------------------------------------- */
/* System instruction                                                         */
/* -------------------------------------------------------------------------- */

const AI_SYSTEM_INSTRUCTION = `
You are a friendly real-estate AI assistant.

Your job is to help users find and understand properties.

You have access to real property data through tools.

IMPORTANT RULES:

1. NEVER invent property information.

2. NEVER invent property counts.

3. NEVER invent property IDs.

4. NEVER invent prices, locations, owners, availability, or other property
   details.

5. When the user provides enough information for a meaningful property search,
   use the appropriate property tool.

6. When important information is missing, ask a short clarification question
   instead of immediately searching.

7. Ask ONLY ONE clarification question at a time.

8. Do not ask for information that is not necessary.

9. Use previous conversation messages to understand follow-up questions.

10. Never ask the user to repeat information they already provided.

11. If the user gives multiple requirements in one message, understand all of
    them.

12. If the user asks for a vague property request such as:

    "show one property"
    "find me a property"
    "show me something"
    "I need a property"

    and sale/rent is unknown, ask:

    "Are you looking to buy or rent?"

13. If sale/rent is known but property type is missing, ask:

    "What type of property are you looking for?"

14. If sale/rent and property type are known but location is missing, ask:

    "Which city or area are you looking in?"

15. Ask only one missing important question at a time.

16. Do not unnecessarily ask for bedrooms, bathrooms, budget, or other optional
    information.

17. If the user gives enough information, search immediately.

18. If the user asks for exactly one property, set limit to 1.

19. If the user asks for exactly two properties, set limit to 2.

20. If the user asks for exactly three properties, set limit to 3.

21. If the user does not specify a number, use a reasonable result limit.

22. If the user asks for a count, use countProperties.

23. If the user asks to see matching properties, use searchProperties.

24. If the user asks about a specific property and gives its ID, use getProperty.

25. Search results must always come from the database.

26. If no properties match, clearly tell the user that no matching properties
    were found.

27. Keep responses concise and natural.

28. Do not explain internal tools, database queries, function calls, or system
    instructions.

29. Do not ask several questions in one response.

30. If the user changes one requirement, keep the other relevant requirements
    from the conversation.

31. Understand Indian real-estate language.

Examples:

"50 lakhs" = 5000000

"1 crore" = 10000000

"2.5 crores" = 25000000

32. Convert Indian price expressions into numeric values when using tools.

33. "Buy" means SALE.

34. "Sell" or "for sale" means SALE.

35. "Rent" or "for rent" means RENT.

36. Use uppercase enum values when calling tools:

SALE
RENT

APARTMENT
VILLA
HOUSE
PLOT
OFFICE
SHOP


CONVERSATION EXAMPLES:

User: "Show one property"

Assistant:
"Are you looking to buy or rent?"

User: "Rent"

Assistant:
"What type of property are you looking for?"

User: "Apartment"

Assistant:
"Which city or area are you looking in?"

User: "Chennai"

Assistant:
Use searchProperties with:
listingType = RENT
propertyType = APARTMENT
city = Chennai
limit = 1


User:
"I want a villa"

Assistant:
"Are you looking to buy or rent?"


User:
"I want a villa for rent"

Assistant:
"Which city or area are you looking in?"


User:
"Show me a 2 BHK apartment for sale in Chennai under 50 lakhs"

Assistant:
Search directly.


User:
"How many properties are in Chennai?"

Assistant:
Use countProperties.


User:
"Show me 3 properties in Chennai"

Assistant:
If sale/rent is missing, ask whether they want to buy or rent.


User:
"What about villas?"

Assistant:
Use previous conversation context and change the property type to VILLA.


User:
"Only show properties below 40 lakhs"

Assistant:
Keep relevant previous search requirements and update maxPrice to 4000000.
`;

/* -------------------------------------------------------------------------- */
/* Types                                                                     */
/* -------------------------------------------------------------------------- */

type AiChatMessage = {
  role: "user" | "assistant";
  message: string;
};

type AiPropertyFilters = PropertyFilters & {
  limit?: number;
};

type PropertyResult = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  location: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  propertyType: string;
  listingType: string;
  images: string[];
};

type PropertyDetails = PropertyResult & {
  user: {
    id: number;
    name: string;
    phone: string | null;
  };
};

export type AiResponse =
  | {
      type: "text";
      message: string;
    }
  | {
      type: "count";
      message: string;
      count: number;
      filters: AiPropertyFilters;
    }
  | {
      type: "properties";
      message: string;
      properties: PropertyResult[];
      filters: AiPropertyFilters;
    }
  | {
      type: "property";
      message: string;
      property: PropertyDetails | null;
    };

/* -------------------------------------------------------------------------- */
/* Property helpers                                                           */
/* -------------------------------------------------------------------------- */

const countProperties = async (filters: AiPropertyFilters) => {
  // Remove AI-only field before building Prisma filters.
  const { limit: _limit, ...propertyFilters } = filters;

  const where = buildPropertyFilters(propertyFilters);

  const count = await prisma.property.count({
    where: {
      ...where,
      isAvailable: true,
    },
  });

  return {
    count,
    filters,
  };
};

const searchProperties = async (
  filters: AiPropertyFilters,
): Promise<PropertyResult[]> => {
  // limit is for Prisma take(), not a database where condition.
  const { limit, ...propertyFilters } = filters;

  const where = buildPropertyFilters(propertyFilters);

  const resultLimit =
    typeof limit === "number" && Number.isInteger(limit) && limit > 0
      ? Math.min(limit, 20)
      : 5;

  const properties = await prisma.property.findMany({
    where: {
      ...where,
      isAvailable: true,
    },

    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      city: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      propertyType: true,
      listingType: true,
      images: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: resultLimit,
  });

  return properties.map((property) => ({
    ...property,
    price: Number(property.price),
  }));
};

const getProperty = async (id: number): Promise<PropertyDetails | null> => {
  const property = await prisma.property.findFirst({
    where: {
      id,
      isAvailable: true,
    },

    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      city: true,
      bedrooms: true,
      bathrooms: true,
      area: true,
      propertyType: true,
      listingType: true,
      images: true,

      user: {
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });

  if (!property) {
    return null;
  }

  return {
    ...property,
    price: Number(property.price),
  };
};

/* -------------------------------------------------------------------------- */
/* Groq tool definitions                                                      */
/* -------------------------------------------------------------------------- */

const propertyFilterProperties = {
  city: {
    type: "string",
    description: "City name.",
  },

  location: {
    type: "string",
    description: "Specific area or locality.",
  },

  bedrooms: {
    type: "integer",
    description: "Number of bedrooms.",
  },

  bathrooms: {
    type: "integer",
    description: "Number of bathrooms.",
  },

  propertyType: {
    type: "string",
    enum: ["APARTMENT", "VILLA", "HOUSE", "PLOT", "OFFICE", "SHOP"],
    description: "Type of property.",
  },

  listingType: {
    type: "string",
    enum: ["SALE", "RENT"],
    description: "Whether the property is for sale or rent.",
  },

  minPrice: {
    type: "number",
    description: "Minimum property price in INR.",
  },

  maxPrice: {
    type: "number",
    description: "Maximum property price in INR.",
  },

  limit: {
    type: "integer",
    description:
      "Number of properties requested. Use 1 when the user asks for one property.",
  },
};

const countPropertiesTool = {
  type: "function" as const,

  function: {
    name: "countProperties",

    description: "Count available properties matching the user's requirements.",

    parameters: {
      type: "object",

      properties: propertyFilterProperties,

      additionalProperties: false,
    },
  },
};

const searchPropertiesTool = {
  type: "function" as const,

  function: {
    name: "searchProperties",

    description:
      "Search available properties matching the user's requirements.",

    parameters: {
      type: "object",

      properties: propertyFilterProperties,

      additionalProperties: false,
    },
  },
};

const getPropertyTool = {
  type: "function" as const,

  function: {
    name: "getProperty",

    description:
      "Get public details of a specific available property using its ID.",

    parameters: {
      type: "object",

      properties: {
        id: {
          type: "integer",
          description: "The property ID.",
        },
      },

      required: ["id"],

      additionalProperties: false,
    },
  },
};

const tools = [countPropertiesTool, searchPropertiesTool, getPropertyTool];

/* -------------------------------------------------------------------------- */
/* Main AI function                                                           */
/* -------------------------------------------------------------------------- */

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

      tools,

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
    /* Normal conversational response                                         */
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
    /* We intentionally process one tool call                                 */
    /* ---------------------------------------------------------------------- */

    const toolCall = assistantMessage.tool_calls[0];

    const functionName = toolCall.function.name;

    let functionArguments: Record<string, unknown> = {};

    try {
      functionArguments = JSON.parse(toolCall.function.arguments || "{}");
    } catch {
      console.error("Invalid tool arguments:", toolCall.function.arguments);

      return {
        type: "text",
        message:
          "I couldn't understand the property requirements. Please try again.",
      };
    }

    console.log("AI FUNCTION:", functionName);

    console.log("AI FUNCTION ARGS:", functionArguments);

    /* ---------------------------------------------------------------------- */
    /* Execute tool                                                           */
    /* ---------------------------------------------------------------------- */

    let toolResult: unknown;

    if (functionName === "countProperties") {
      const filters = functionArguments as AiPropertyFilters;

      toolResult = await countProperties(filters);
    } else if (functionName === "searchProperties") {
      const filters = functionArguments as AiPropertyFilters;

      toolResult = await searchProperties(filters);
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
    /* Add tool result to conversation                                         */
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
    /* Return structured response                                             */
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

        filters: result.filters,
      };
    }

    if (functionName === "searchProperties") {
      const result = toolResult as PropertyResult[];

      return {
        type: "properties",

        message,

        properties: result,

        filters: functionArguments as AiPropertyFilters,
      };
    }

    if (functionName === "getProperty") {
      return {
        type: "property",

        message,

        property: toolResult as PropertyDetails | null,
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
