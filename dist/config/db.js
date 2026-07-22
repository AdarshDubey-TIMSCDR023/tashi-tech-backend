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

        console.log("🔄 Connecting to MongoDB...");
        
        // Add connection options for better reliability
        const conn = await mongoose_1.default.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Time to wait for server selection
            socketTimeoutMS: 45000, // Socket timeout
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            retryReads: true,
        });

        console.log("✅ MongoDB connected successfully.");
        console.log(`📊 Database: ${mongoose_1.default.connection.name}`);
        console.log(`🖥️  Host: ${mongoose_1.default.connection.host}`);
        console.log(`🔗 Connection State: ${mongoose_1.default.connection.readyState}`);
        
        return conn;
    } catch (error) {
        console.error("❌ MongoDB connection failed.");
        console.error("Error details:", error.message || error);
        
        // Log additional details if available
        if (error.name === 'MongoServerSelectionError') {
            console.error("💡 This could be due to:");
            console.error("   - IP not whitelisted in MongoDB Atlas");
            console.error("   - Incorrect connection string");
            console.error("   - Network connectivity issues");
            console.error("   - MongoDB cluster is paused or deleted");
        }
        
        // Re-throw the error so the calling function can handle it
        throw error;
    }
};

exports.connectDB = connectDB;
