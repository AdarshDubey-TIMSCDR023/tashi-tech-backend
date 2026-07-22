"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }
        console.log("Connecting to MongoDB...");
        await mongoose_1.default.connect(mongoURI);
        console.log("MongoDB connected successfully.");
        console.log(`Database: ${mongoose_1.default.connection.name}`);
        console.log(`Host: ${mongoose_1.default.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection failed.");
        console.error(error);
        if (process.env.NODE_ENV === "production") {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
