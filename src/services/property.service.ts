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

interface GetPropertiesOptions {
  page: number;
  limit: number;
  city?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: PropertySort;
}

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
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
    sort,
  } = options;

  const where = buildPropertyFilters({
    city,
    propertyType,
    listingType,
    minPrice,
    maxPrice,
  });

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
          select: {
            id: true,
            name: true,
            phone: true,
          },
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
        select: {
          id: true,
          name: true,
          phone: true,
        },
      },
    },
  });
}

export async function updateProperty(
  id: number,
  userId: number,
  data: Partial<CreatePropertyData>,
) {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw createHttpError("Property not found", 404);
  }

  if (property.userId !== userId) {
    throw createHttpError("You are not allowed to update this property", 403);
  }

  return await prisma.property.update({
    where: { id },
    data,
  });
}

export async function deleteProperty(id: number, userId: number) {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw createHttpError("Property not found", 404);
  }

  if (property.userId !== userId) {
    throw createHttpError("You are not allowed to delete this property", 403);
  }

  return await prisma.property.delete({
    where: { id },
  });
}
