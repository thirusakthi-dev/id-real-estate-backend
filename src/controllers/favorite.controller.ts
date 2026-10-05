import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth.js";
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
} from "../services/favorite.service.js";

export async function addFavoriteController(
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

    const propertyId = Number(req.params.propertyId);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const favorite = await addFavorite(req.userId, propertyId);

    return res.status(201).json({
      success: true,
      message: "Property added to favorites",
      data: favorite,
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
      error.message === "Property already added to favorites"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

export async function removeFavoriteController(
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

    const propertyId = Number(req.params.propertyId);

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    await removeFavorite(req.userId, propertyId);

    return res.status(200).json({
      success: true,
      message: "Property removed from favorites",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Property is not in your favorites"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
}

export async function getUserFavoritesController(
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

    const favorites = await getUserFavorites(req.userId);

    return res.status(200).json({
      success: true,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
}
