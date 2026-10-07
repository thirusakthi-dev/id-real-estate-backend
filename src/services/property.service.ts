import { prisma } from "../lib/prisma.js";

import { buildPropertyFilters } from "../utils/property.filters.js";

import {
  getPagination,
  getPaginationResponse,
} from "../utils/property.pagination.js";

import { getPropertySort, PropertySort } from "../utils/property.sorting.js";

import { createHttpError } from "../utils/http-error.js";

interface CreatePropertyData {
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType: "APARTMENT" | "VILLA" | "HOUSE" | "PLOT" | "OFFICE" | "SHOP";
  listingType: "SALE" | "RENT";
  images: string[];
  userId: number;
}

interface UpdatePropertyData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: "APARTMENT" | "VILLA" | "HOUSE" | "PLOT" | "OFFICE" | "SHOP";
  listingType?: "SALE" | "RENT";
  newImages?: string[];
}

interface GetPropertiesOptions {
  page: number;
  limit: number;
  search?: string;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: PropertySort;
  userId?: number;
}

const propertyOwnerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  whatsapp: true,
  instagram: true,
  facebook: true,
  linkedin: true,
};

export async function createProperty(data: CreatePropertyData) {
  return await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      city: data.city,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      area: data.area,
      propertyType: data.propertyType,
      listingType: data.listingType,
      images: data.images ?? [],
      userId: data.userId,
    },
  });
}

export async function getAllProperties(options: GetPropertiesOptions) {
  const {
    page,
    limit,
    search,
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    sort,
    userId,
  } = options;

  const propertyFilters = buildPropertyFilters({
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
  });

  const where = {
    ...propertyFilters,

    ...(search?.trim() && {
      title: {
        startsWith: search.trim(),
        mode: "insensitive" as const,
      },
    }),

    ...(userId !== undefined && {
      userId,
    }),
  };

  const { skip, take } = getPagination({
    page,
    limit,
  });

  const orderBy = getPropertySort(sort);

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,

      include: {
        user: {
          select: propertyOwnerSelect,
        },
      },
    }),

    prisma.property.count({
      where,
    }),
  ]);

  return {
    properties,
    pagination: getPaginationResponse(page, limit, total),
  };
}

export async function getPropertyById(id: number) {
  return await prisma.property.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: propertyOwnerSelect,
      },
    },
  });
}

export async function updateProperty(
  id: number,
  userId: number,
  data: UpdatePropertyData,
) {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw createHttpError("Property not found", 404);
  }

  if (property.userId !== userId) {
    throw createHttpError("You are not allowed to update this property", 403);
  }

  const { newImages, ...propertyData } = data;

  const images = [...(property.images ?? []), ...(newImages ?? [])];

  return await prisma.property.update({
    where: {
      id,
    },
    data: {
      ...propertyData,
      images,
    },
  });
}

export async function deleteProperty(id: number, userId: number) {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw createHttpError("Property not found", 404);
  }

  if (property.userId !== userId) {
    throw createHttpError("You are not allowed to delete this property", 403);
  }

  return await prisma.property.delete({
    where: {
      id,
    },
  });
}
