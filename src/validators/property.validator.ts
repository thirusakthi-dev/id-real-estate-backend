import { z } from "zod";

export const createPropertySchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),

  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),

  price: z.coerce.number().positive("Price must be greater than 0"),

  location: z.string().min(2, "Location is required"),

  city: z.string().min(2, "City is required"),

  bedrooms: z.coerce.number().int().positive().optional(),

  bathrooms: z.coerce.number().int().positive().optional(),

  area: z.coerce.number().int().positive().optional(),

  propertyType: z.enum([
    "APARTMENT",
    "VILLA",
    "HOUSE",
    "PLOT",
    "OFFICE",
    "SHOP",
  ]),

  listingType: z.enum(["SALE", "RENT"]),

  images: z
    .array(z.url("Invalid image URL"))
    .max(10, "Maximum 10 images allowed")
    .optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  city: z.string().optional(),

  propertyType: z
    .enum(["APARTMENT", "VILLA", "HOUSE", "PLOT", "OFFICE", "SHOP"])
    .optional(),

  listingType: z.enum(["SALE", "RENT"]).optional(),

  minPrice: z.coerce.number().positive().optional(),

  maxPrice: z.coerce.number().positive().optional(),

  sort: z.enum(["price_asc", "price_desc", "latest"]).optional(),

  mine: z.coerce.boolean().default(false),
});
