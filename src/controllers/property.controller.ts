import { Response, NextFunction } from "express";

import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from "../services/property.service.js";

import { AuthRequest } from "../middleware/auth.js";

import { uploadImage } from "../lib/cloudinary.js";

async function uploadPropertyImages(
  files: Express.Multer.File[] = [],
): Promise<string[]> {
  const imageUrls: string[] = [];

  for (const file of files) {
    const imageUrl = await uploadImage(file);
    imageUrls.push(imageUrl);
  }

  return imageUrls;
}

export async function createPropertyController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const files = req.files as Express.Multer.File[];

    const imageUrls = await uploadPropertyImages(files);

    const property = await createProperty({
      ...req.body,
      images: imageUrls,
      userId: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPropertiesController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const mine = String(req.query.mine) === "true";

    if (mine && !req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await getAllProperties({
      page: Number(req.query.page) || 1,

      limit: Number(req.query.limit) || 10,

      city: req.query.city as string,

      propertyType: req.query.propertyType as string,

      listingType: req.query.listingType as string,

      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,

      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,

      sort: req.query.sort as "price_asc" | "price_desc" | "latest" | undefined,

      userId: mine ? req.userId : undefined,
    });

    return res.status(200).json({
      success: true,
      data: result.properties,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPropertyController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await getPropertyById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePropertyController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const files = (req.files as Express.Multer.File[]) ?? [];

    const existingImages = Array.isArray(req.body.existingImages)
      ? req.body.existingImages
      : req.body.existingImages
        ? [req.body.existingImages]
        : [];

    const uploadedImages =
      files.length > 0 ? await uploadPropertyImages(files) : [];

    // Keep existing images + add new images
    const images = [...existingImages, ...uploadedImages];

    const property = await updateProperty(id, req.userId, {
      ...req.body,
      images,
    });

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Property not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "You are not allowed to update this property"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

export async function deletePropertyController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    await deleteProperty(id, req.userId);

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Property not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message === "You are not allowed to delete this property"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}
