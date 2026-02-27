import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

import healthcheckRouter from "./routes/healthcheck.routes.js";
import animeRouter from "./routes/anime.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/anime", animeRouter);

export default app;
