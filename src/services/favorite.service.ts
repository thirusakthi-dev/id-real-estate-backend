import { prisma } from "../lib/prisma.js";
import { createHttpError } from "../utils/http-error.js";

export async function addFavorite(userId: number, propertyId: number) {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw createHttpError("Property not found", 404);
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });

  if (existingFavorite) {
    throw createHttpError("Property already added to favorites", 409);
  }

  return await prisma.favorite.create({
    data: {
      userId,
      propertyId,
    },
  });
}

export async function removeFavorite(userId: number, propertyId: number) {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });

  if (!favorite) {
    throw createHttpError("Property is not in your favorites", 404);
  }

  return await prisma.favorite.delete({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
}

export async function getUserFavorites(userId: number) {
  return await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      property: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              whatsapp: true,
              instagram: true,
              facebook: true,
              linkedin: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
