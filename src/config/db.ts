import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in the environment variables.");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully.");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed.");
    console.error(error);

    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};