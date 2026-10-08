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
      "Number of properties requested. Use the exact number requested by the user.",
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
      "Search available properties matching the user's requirements. Use this when the user wants to see property results.",

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

export const aiTools = [
  countPropertiesTool,
  searchPropertiesTool,
  getPropertyTool,
];
