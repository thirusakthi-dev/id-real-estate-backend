import type { AiPropertyFilters } from "./ai-types.js";

const VALID_PROPERTY_TYPES = [
  "APARTMENT",
  "VILLA",
  "HOUSE",
  "PLOT",
  "OFFICE",
  "SHOP",
] as const;

const VALID_LISTING_TYPES = ["SALE", "RENT"] as const;

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

const parsePositiveInteger = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isInteger(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return undefined;
};

const parsePrice = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const cleaned = value.replace(/,/g, "").replace(/₹/g, "").trim();

    const parsed = Number(cleaned);

    if (Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return undefined;
};

export const sanitizeAiFilters = (
  input: Record<string, unknown>,
): AiPropertyFilters => {
  const filters: AiPropertyFilters = {};

  if (isNonEmptyString(input.city)) {
    filters.city = input.city.trim();
  }

  if (isNonEmptyString(input.location)) {
    filters.location = input.location.trim();
  }

  const bedrooms = parsePositiveInteger(input.bedrooms);

  if (bedrooms !== undefined) {
    filters.bedrooms = bedrooms;
  }

  const bathrooms = parsePositiveInteger(input.bathrooms);

  if (bathrooms !== undefined) {
    filters.bathrooms = bathrooms;
  }

  if (isNonEmptyString(input.propertyType)) {
    const propertyType = input.propertyType.trim().toUpperCase();

    if (
      VALID_PROPERTY_TYPES.includes(
        propertyType as (typeof VALID_PROPERTY_TYPES)[number],
      )
    ) {
      filters.propertyType = propertyType as AiPropertyFilters["propertyType"];
    }
  }

  if (isNonEmptyString(input.listingType)) {
    const listingType = input.listingType.trim().toUpperCase();

    if (
      VALID_LISTING_TYPES.includes(
        listingType as (typeof VALID_LISTING_TYPES)[number],
      )
    ) {
      filters.listingType = listingType as AiPropertyFilters["listingType"];
    }
  }

  const minPrice = parsePrice(input.minPrice);

  if (minPrice !== undefined) {
    filters.minPrice = minPrice;
  }

  const maxPrice = parsePrice(input.maxPrice);

  if (maxPrice !== undefined) {
    filters.maxPrice = maxPrice;
  }

  return filters;
};
