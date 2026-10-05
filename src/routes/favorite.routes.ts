import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  addFavoriteController,
  removeFavoriteController,
  getUserFavoritesController,
} from "../controllers/favorite.controller.js";

const router = Router();

router.get("/", authenticate, getUserFavoritesController);

router.post("/:propertyId", authenticate, addFavoriteController);

router.delete("/:propertyId", authenticate, removeFavoriteController);

export default router;
