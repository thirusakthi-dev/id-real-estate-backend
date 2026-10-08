const propertyFilterProperties = {
  city: {
    type: "string",
    description:
      "City name. Include only when the user explicitly provides a city. Never use an empty string or null.",
  },

  location: {
    type: "string",
    description:
      "Specific locality or area. Include only when the user explicitly provides an area. Never use an empty string or null.",
  },

  bedrooms: {
    type: "integer",
    description:
      "Number of bedrooms. Include only when the user explicitly specifies bedrooms. Never use an empty string or null.",
  },

  bathrooms: {
    type: "integer",
    description:
      "Number of bathrooms. Include only when the user explicitly specifies bathrooms. Never use an empty string or null.",
  },

  propertyType: {
    type: "string",
    description:
      "Property type. Valid values are APARTMENT, VILLA, HOUSE, PLOT, OFFICE, SHOP. Include only when explicitly specified. Never use an empty string or null.",
  },

  listingType: {
    type: "string",
    description:
      "Listing type. Valid values are SALE or RENT. Include only when explicitly specified. Never use an empty string or null.",
  },

  minPrice: {
    type: "number",
    description:
      "Minimum property price in INR. Include only when the user specifies a minimum budget. Must be a numeric INR value. Never use an empty string or null.",
  },

  maxPrice: {
    type: "number",
    description:
      "Maximum property price in INR. Include only when the user specifies a maximum budget. Must be a numeric INR value. Never use an empty string or null.",
  },
};

const countPropertiesTool = {
  type: "function" as const,

  function: {
    name: "countProperties",

    description:
      "Count available real-estate properties matching the user's requirements. Only include filter fields explicitly provided by the user or established in the conversation. Omit unknown fields completely.",

    parameters: {
      type: "object",

      properties: propertyFilterProperties,

      required: [],

      additionalProperties: false,
    },
  },
};

const searchPropertiesTool = {
  type: "function" as const,

  function: {
    name: "searchProperties",

    description:
      "Search available real-estate properties matching the user's requirements. Only include filter fields explicitly provided by the user or established in the conversation. Omit unknown fields completely.",

    parameters: {
      type: "object",

      properties: propertyFilterProperties,

      required: [],

      additionalProperties: false,
    },
  },
};

const getPropertyTool = {
  type: "function" as const,

  function: {
    name: "getProperty",

    description:
      "Get details of one available property using its numeric property ID.",

    parameters: {
      type: "object",

      properties: {
        id: {
          type: "integer",
          description: "The numeric property ID.",
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
