import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

import UserRoutes from "./routes/user.routes.js";
import PropertyRoutes from "./routes/property.routes.js";
import FavoriteRoutes from "./routes/favorite.routes.js";
import SeedRoutes from "./routes/seed.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { errorHandler } from "./middleware/error.middleware.js";
import {
  apiLimiter,
  authLimiter,
  aiLimiter,
} from "./middleware/rate-limit.middleware.js";

const app: Application = express();

/* -------------------- Security -------------------- */

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URLS?.split(",").map((url) => url.trim()),
    credentials: true,
  }),
);

/* -------------------- Body Parsing -------------------- */

app.use(express.json({ limit: "1mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

/* -------------------- Rate Limiting -------------------- */

// General API
app.use("/api/properties", apiLimiter);
app.use("/api/favorites", apiLimiter);
app.use("/api/seed", apiLimiter);

// Authentication
app.use("/api/users/login", authLimiter);
app.use("/api/users/register", authLimiter);

// AI
app.use("/api/ai", aiLimiter);

/* -------------------- Routes -------------------- */

app.use("/api/users", UserRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/favorites", FavoriteRoutes);
app.use("/api/seed", SeedRoutes);
app.use("/api/ai", aiRoutes);

/* -------------------- Error Handler -------------------- */

app.use(errorHandler);

export default app;
