import express from "express";
import cors from "cors";
import { corsOrigins } from "./config/env.js";
import { APIError } from "./utils/api-error.js";

import healthcheckRouter from "./routes/healthcheck.routes.js";
import animeRouter from "./routes/anime.routes.js";
import movieRouter from "./routes/movie.routes.js";
import gameRouter from "./routes/games.routes.js";
import taskRouter from "./routes/task.routes.js";
import sectionRouter from "./routes/section.routes.js";

const app = express();
const allowedOrigins = corsOrigins();

app.disable("x-powered-by");
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 1));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new APIError(403, "Origin is not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/anime", animeRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/game", gameRouter);
app.use("/api/v1/task", taskRouter);
app.use("/api/v1", sectionRouter);

app.use((req, res, next) => {
  next(new APIError(404, "Route not found"));
});

app.use((err, req, res, next) => {
  let statusCode = Number(err.statusCode) || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body contains invalid JSON";
  } else if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Request validation failed";
    errors = Object.values(err.errors).map((item) => item.message);
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Request contains an invalid identifier";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = "This item already exists";
  }

  if (statusCode >= 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
    errors = [];
  }

  console.error(`[${req.method}] ${req.originalUrl}:`, err.message);

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
});

export default app;
