import express from "express";
import logger from "./middlewares/logger.js";

const PORT = process.env.PORT || 8081;

const app = express();

// middlewares
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server is running on Port:${PORT}`);
});
