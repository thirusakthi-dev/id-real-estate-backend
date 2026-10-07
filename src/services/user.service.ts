import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";
import { createHttpError } from "../utils/http-error.js";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  city?: string;
  avatar?: string;
  whatsapp?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export async function createUser(data: CreateUserData) {
  const email = data.email.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw createHttpError("User with this email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email,
      password: hashedPassword,
      phone: data.phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase().trim(),
    },
  });

  if (!user) {
    throw createHttpError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    },
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
    token,
  };
}

export async function updateUser(userId: number, data: UpdateUserData) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw createHttpError("User not found", 404);
  }

  const email = data.email?.toLowerCase().trim();

  if (email && email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw createHttpError("User with this email already exists", 409);
    }
  }

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      ...(data.name !== undefined && {
        name: data.name.trim(),
      }),

      ...(email !== undefined && {
        email,
      }),

      ...(data.phone !== undefined && {
        phone: data.phone.trim() || null,
      }),

      ...(data.bio !== undefined && {
        bio: data.bio.trim() || null,
      }),

      ...(data.city !== undefined && {
        city: data.city.trim() || null,
      }),

      ...(data.avatar !== undefined && {
        avatar: data.avatar.trim() || null,
      }),

      ...(data.whatsapp !== undefined && {
        whatsapp: data.whatsapp.trim() || null,
      }),

      ...(data.instagram !== undefined && {
        instagram: data.instagram.trim() || null,
      }),

      ...(data.facebook !== undefined && {
        facebook: data.facebook.trim() || null,
      }),

      ...(data.linkedin !== undefined && {
        linkedin: data.linkedin.trim() || null,
      }),
    },

    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      bio: true,
      city: true,
      avatar: true,
      whatsapp: true,
      instagram: true,
      facebook: true,
      linkedin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
