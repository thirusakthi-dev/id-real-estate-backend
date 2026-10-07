import { z } from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .optional(),
});

export const loginUserSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),

  email: z.email("Invalid email address").optional(),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number")
    .optional(),

  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),

  city: z.string().max(100, "City must not exceed 100 characters").optional(),

  avatar: z.url("Invalid avatar URL").optional(),

  whatsapp: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid WhatsApp number")
    .optional(),

  instagram: z.url("Invalid Instagram URL").optional(),

  facebook: z.url("Invalid Facebook URL").optional(),

  linkedin: z.url("Invalid LinkedIn URL").optional(),
});
