import express from "express";
import logger from "./middlewares/logger.middleware.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = ENV.PORT || 8081;

const app = express();

// middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("<h1>X Native Clone</h1>");
});

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on Port:${PORT}`);
    })
  )
  .catch((err) => {
    console.error("Failed to connect to DB. Exiting...", err);
    process.exit(1);
  });
