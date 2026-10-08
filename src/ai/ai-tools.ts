const propertyFilterProperties = {
  city: {
    type: "string",
    description:
      "City name. Omit this field if the user did not provide a city. Never use null.",
  },

  location: {
    type: "string",
    description:
      "Specific locality or area. Omit this field if the user did not provide an area. Never use null.",
  },

  bedrooms: {
    type: "string",
    description:
      "Number of bedrooms. Send as a string containing an integer, for example '2'. Omit if not specified.",
  },

  bathrooms: {
    type: "string",
    description:
      "Number of bathrooms. Send as a string containing an integer, for example '2'. Omit if not specified.",
  },

  propertyType: {
    type: "string",
    description:
      "Property type. Valid values are APARTMENT, VILLA, HOUSE, PLOT, OFFICE, SHOP. Omit if not specified.",
  },

  listingType: {
    type: "string",
    description:
      "Listing type. Valid values are SALE or RENT. Omit if not specified.",
  },

  minPrice: {
    type: "string",
    description:
      "Minimum price in INR. Send numeric INR value as a string, for example '5000000'. Omit if not specified.",
  },

  maxPrice: {
    type: "string",
    description:
      "Maximum price in INR. Send numeric INR value as a string, for example '5000000'. Omit if not specified.",
  },
};

const countPropertiesTool = {
  type: "function" as const,

  function: {
    name: "countProperties",

    description:
      "Count available real-estate properties matching the user's requirements. Only include values explicitly known from the user or conversation. Never invent values.",

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
      "Search available real-estate properties matching the user's requirements. Only include values explicitly known from the user or conversation. Never invent values.",

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
      "Get details of one available property using its numeric property ID.",

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
