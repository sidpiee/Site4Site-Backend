import app from "./app.js";
import { validateEnvironment } from "./config/env.js";
import connectDB from "./db/index.js";

validateEnvironment();

const port = Number(process.env.PORT ?? 8000);

connectDB()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });

    server.requestTimeout = 30000;
    server.headersTimeout = 35000;
  })
  .catch((error) => {
    console.error("Application startup failed", error);
    process.exit(1);
  });
