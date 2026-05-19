import dotenv from "dotenv";
import app from "./app.js";
import dns from "dns";
import connectDB from "./db/index.js";
dns.setServers(["1.1.1.1" , "8.8.8.8"]);
dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });
