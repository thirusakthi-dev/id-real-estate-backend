import express, { Application } from "express";
import cors from "cors";

import UserRoutes from "./routes/user.routes.js";
import PropertyRoutes from "./routes/property.routes.js";
import FavoriteRoutes from "./routes/favorite.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app: Application = express();

const allowedOrigins = process.env.FRONTEND_URLS?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Real Estate API is running",
  });
});

app.use("/api/users", UserRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/favorites", FavoriteRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export default app;
