import { Type } from "@google/genai";

import { gemini } from "../lib/gemini.js";
import { prisma } from "../lib/prisma.js";

import {
  buildPropertyFilters,
  type PropertyFilters,
} from "../utils/property.filters.js";

const AI_SYSTEM_INSTRUCTION = `
You are an AI assistant for a real-estate application.

You can help users:
- Search properties
- Count properties
- View property details
- Understand property information

Public property information is available without login.

Rules:
- Never invent property information.
- Never invent property counts.
- Use the available tools when real database information is required.
- Only use information returned by the tools.
- Keep responses concise and helpful.
- Do not repeat large property details in your message because the frontend
  will display structured property cards.
- Use conversation history to understand follow-up questions.
- When the user says things like "what about villas", "under 50 lakhs",
  "in that area", or similar follow-ups, use the previous conversation
  to understand the missing context.
`;

const CHAT_HISTORY_LIMIT = 10;

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type AiChatMessage = {
  role: "user" | "assistant";
  message: string;
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
      filters: PropertyFilters;
    }
  | {
      type: "properties";
      message: string;
      properties: PropertyResult[];
      filters: PropertyFilters;
    }
  | {
      type: "property";
      message: string;
      property: PropertyDetails | null;
    };

// ─────────────────────────────────────────────
// Count Properties
// ─────────────────────────────────────────────

const countProperties = async (filters: PropertyFilters) => {
  const where = buildPropertyFilters(filters);

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

// ─────────────────────────────────────────────
// Search Properties
// ─────────────────────────────────────────────

const searchProperties = async (
  filters: PropertyFilters,
): Promise<PropertyResult[]> => {
  const where = buildPropertyFilters(filters);

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

    take: 5,
  });

  return properties.map((property) => ({
    ...property,
    price: Number(property.price),
  }));
};

// ─────────────────────────────────────────────
// Get Property
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// Count Properties Tool
// ─────────────────────────────────────────────

const countPropertiesTool = {
  name: "countProperties",

  description:
    "Count available properties matching the user's search criteria.",

  parameters: {
    type: Type.OBJECT,

    properties: {
      city: {
        type: Type.STRING,
        description: "City name",
      },

      location: {
        type: Type.STRING,
        description: "Location or area name",
      },

      bedrooms: {
        type: Type.INTEGER,
        description: "Number of bedrooms",
      },

      bathrooms: {
        type: Type.INTEGER,
        description: "Number of bathrooms",
      },

      propertyType: {
        type: Type.STRING,
        enum: ["APARTMENT", "VILLA", "HOUSE", "PLOT", "OFFICE", "SHOP"],
        description: "Type of property",
      },

      listingType: {
        type: Type.STRING,
        enum: ["SALE", "RENT"],
        description: "Whether the property is for sale or rent",
      },

      minPrice: {
        type: Type.NUMBER,
        description: "Minimum property price",
      },

      maxPrice: {
        type: Type.NUMBER,
        description: "Maximum property price",
      },
    },
  },
};

// ─────────────────────────────────────────────
// Search Properties Tool
// ─────────────────────────────────────────────

const searchPropertiesTool = {
  name: "searchProperties",

  description: "Search available properties matching the user's requirements.",

  parameters: {
    type: Type.OBJECT,

    properties: {
      city: {
        type: Type.STRING,
        description: "City name",
      },

      location: {
        type: Type.STRING,
        description: "Location or area name",
      },

      bedrooms: {
        type: Type.INTEGER,
        description: "Number of bedrooms",
      },

      bathrooms: {
        type: Type.INTEGER,
        description: "Number of bathrooms",
      },

      propertyType: {
        type: Type.STRING,
        enum: ["APARTMENT", "VILLA", "HOUSE", "PLOT", "OFFICE", "SHOP"],
        description: "Type of property",
      },

      listingType: {
        type: Type.STRING,
        enum: ["SALE", "RENT"],
        description: "Whether the property is for sale or rent",
      },

      minPrice: {
        type: Type.NUMBER,
        description: "Minimum property price",
      },

      maxPrice: {
        type: Type.NUMBER,
        description: "Maximum property price",
      },
    },
  },
};

// ─────────────────────────────────────────────
// Get Property Tool
// ─────────────────────────────────────────────

const getPropertyTool = {
  name: "getProperty",

  description:
    "Get the public details of a specific available property using its ID.",

  parameters: {
    type: Type.OBJECT,

    properties: {
      id: {
        type: Type.INTEGER,
        description: "The property ID",
      },
    },

    required: ["id"],
  },
};

// ─────────────────────────────────────────────
// Generate Final AI Message
// ─────────────────────────────────────────────

const generateFinalAiMessage = async (
  history: AiChatMessage[],
  userMessage: string,
  functionCall: NonNullable<
    Awaited<ReturnType<typeof gemini.models.generateContent>>["functionCalls"]
  >[number],
  result: Record<string, unknown>,
) => {
  const contents = [
    ...history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: item.message,
        },
      ],
    })),

    {
      role: "user",
      parts: [
        {
          text: userMessage,
        },
      ],
    },

    {
      role: "model",
      parts: [
        {
          functionCall,
        },
      ],
    },

    {
      role: "user",
      parts: [
        {
          functionResponse: {
            name: functionCall.name,
            response: result,
          },
        },
      ],
    },
  ];

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",

    contents,

    config: {
      systemInstruction: AI_SYSTEM_INSTRUCTION,
    },
  });

  return response.text ?? "";
};

// ─────────────────────────────────────────────
// Generate AI Response
// ─────────────────────────────────────────────

export const generateAiResponse = async (
  userMessage: string,
  history: AiChatMessage[] = [],
): Promise<AiResponse> => {
  const limitedHistory = history.slice(-CHAT_HISTORY_LIMIT);

  const contents = [
    ...limitedHistory.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: item.message,
        },
      ],
    })),

    {
      role: "user",
      parts: [
        {
          text: userMessage,
        },
      ],
    },
  ];

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",

    contents,

    config: {
      systemInstruction: AI_SYSTEM_INSTRUCTION,

      tools: [
        {
          functionDeclarations: [
            countPropertiesTool,
            searchPropertiesTool,
            getPropertyTool,
          ],
        },
      ],
    },
  });

  const functionCall = response.functionCalls?.[0];

  // ─────────────────────────────────────────────
  // Normal Chat
  // ─────────────────────────────────────────────

  if (!functionCall) {
    return {
      type: "text",
      message: response.text ?? "",
    };
  }

  // ─────────────────────────────────────────────
  // Count Properties
  // ─────────────────────────────────────────────

  if (functionCall.name === "countProperties") {
    const filters = (functionCall.args ?? {}) as PropertyFilters;

    const data = await countProperties(filters);

    const aiMessage = await generateFinalAiMessage(
      limitedHistory,
      userMessage,
      functionCall,
      {
        output: data,
      },
    );

    return {
      type: "count",
      message: aiMessage,
      count: data.count,
      filters: data.filters,
    };
  }

  // ─────────────────────────────────────────────
  // Search Properties
  // ─────────────────────────────────────────────

  if (functionCall.name === "searchProperties") {
    const filters = (functionCall.args ?? {}) as PropertyFilters;

    const properties = await searchProperties(filters);

    const aiMessage = await generateFinalAiMessage(
      limitedHistory,
      userMessage,
      functionCall,
      {
        output: properties,
      },
    );

    return {
      type: "properties",
      message: aiMessage,
      properties,
      filters,
    };
  }

  // ─────────────────────────────────────────────
  // Get Property
  // ─────────────────────────────────────────────

  if (functionCall.name === "getProperty") {
    const propertyId = Number(functionCall.args?.id);

    const property = await getProperty(propertyId);

    const aiMessage = await generateFinalAiMessage(
      limitedHistory,
      userMessage,
      functionCall,
      {
        output: property,
      },
    );

    return {
      type: "property",
      message: aiMessage,
      property,
    };
  }

  // ─────────────────────────────────────────────
  // Unknown Tool
  // ─────────────────────────────────────────────

  return {
    type: "text",
    message: response.text ?? "",
  };
};
