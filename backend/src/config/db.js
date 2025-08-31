import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("Connected to DB SUCCESSFULLY ✅");
  } catch (error) {
    console.log("Error connecting to X_DB", error);
    process.exit(1);
  }
};
