"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tashitech';
        console.log(`Connecting to MongoDB...`);
        await mongoose_1.default.connect(connStr);
        console.log(`MongoDB Connected successfully!`);
    }
    catch (error) {
        console.error(`MongoDB connection error:`, error);
        // Do not crash the process in development to allow mock fallbacks
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
