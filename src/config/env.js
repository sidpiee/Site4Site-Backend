import dotenv from "dotenv";

dotenv.config({ path: "./.env", quiet: true });

const requiredVariables = [
  "CORS_ORIGIN",
  "MONGO_URI",
  "OMDB_API_KEY",
  "RAWG_API_KEY",
  "SUPABASE_ANON_KEY",
  "SUPABASE_URL",
];

const validateEnvironment = () => {
  const missing = requiredVariables.filter(
    (name) => !process.env[name]?.trim(),
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }

  const port = Number(process.env.PORT ?? 8000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const supabaseUrl = new URL(process.env.SUPABASE_URL);
  if (supabaseUrl.protocol !== "https:") {
    throw new Error("SUPABASE_URL must use HTTPS");
  }

  if (!/^mongodb(\+srv)?:\/\//.test(process.env.MONGO_URI)) {
    throw new Error("MONGO_URI must be a valid MongoDB connection string");
  }
};

const corsOrigins = () =>
  (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export { corsOrigins, validateEnvironment };
