import { Prisma } from "@prisma/client";

export interface PropertyFilters {
  city?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
}

export function buildPropertyFilters(
  filters: PropertyFilters,
): Prisma.PropertyWhereInput {
  const {
    city,
    location,
    bedrooms,
    bathrooms,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
  } = filters;

  const where: Prisma.PropertyWhereInput = {};

  if (city) {
    where.city = {
      contains: city,
      mode: "insensitive",
    };
  }

  if (location) {
    where.location = {
      contains: location,
      mode: "insensitive",
    };
  }

  if (bedrooms !== undefined) {
    where.bedrooms = bedrooms;
  }

  if (bathrooms !== undefined) {
    where.bathrooms = bathrooms;
  }

  if (propertyType) {
    where.propertyType =
      propertyType as Prisma.PropertyWhereInput["propertyType"];
  }

  if (listingType) {
    where.listingType = listingType as Prisma.PropertyWhereInput["listingType"];
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {
      ...(minPrice !== undefined && {
        gte: minPrice,
      }),

      ...(maxPrice !== undefined && {
        lte: maxPrice,
      }),
    };
  }

  return where;
}
