const propertyFilterProperties = {
  city: {
    type: "string",
    description: "City name. Only include when the user specifies a city.",
  },

  location: {
    type: "string",
    description:
      "Specific area or locality. Only include when the user specifies an area.",
  },

  bedrooms: {
    type: "integer",
    description:
      "Number of bedrooms. Only include when the user specifies bedrooms.",
  },

  bathrooms: {
    type: "integer",
    description:
      "Number of bathrooms. Only include when the user specifies bathrooms.",
  },

  propertyType: {
    type: "string",
    enum: ["APARTMENT", "VILLA", "HOUSE", "PLOT", "OFFICE", "SHOP"],
    description: "Property type. Only include when specified by the user.",
  },

  listingType: {
    type: "string",
    enum: ["SALE", "RENT"],
    description:
      "Whether the property is for sale or rent. Only include when specified by the user.",
  },

  minPrice: {
    type: "number",
    description:
      "Minimum property price in INR. Only include when specified by the user.",
  },

  maxPrice: {
    type: "number",
    description:
      "Maximum property price in INR. Only include when specified by the user.",
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
      "Search available properties matching the user's requirements. Return matching properties from the database.",

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
