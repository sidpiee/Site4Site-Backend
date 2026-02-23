import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.static("public"));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

export default app;
