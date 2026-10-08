import type { PropertyFilters } from "../utils/property.filters.js";

export type AiChatMessage = {
  role: "user" | "assistant";
  message: string;
};

export type AiPropertyFilters = PropertyFilters;

export type PropertyResult = {
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

export type PropertyDetails = PropertyResult & {
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
