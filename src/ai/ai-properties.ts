import { prisma } from "../lib/prisma.js";

import { buildPropertyFilters } from "../utils/property.filters.js";

import type {
  AiPropertyFilters,
  PropertyDetails,
  PropertyResult,
} from "./ai-types.js";

export const countProperties = async (filters: AiPropertyFilters) => {
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

export const searchProperties = async (
  filters: AiPropertyFilters,
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

export const getProperty = async (
  id: number,
): Promise<PropertyDetails | null> => {
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
