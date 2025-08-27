import express from "express";
import logger from "./middlewares/logger.middleware.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";

const PORT = ENV.PORT || 8081;

const app = express();

// middlewares
app.use(cors());
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(clerkMiddleware());

// routes
app.get("/", (req, res) => {
  res.send("<h1>X Native Clone</h1>");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
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
