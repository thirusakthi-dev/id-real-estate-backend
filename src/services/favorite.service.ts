import { prisma } from "../lib/prisma.js";

export async function addFavorite(userId: number, propertyId: number) {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
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
    throw new Error("Property already added to favorites");
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
    throw new Error("Property is not in your favorites");
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
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
