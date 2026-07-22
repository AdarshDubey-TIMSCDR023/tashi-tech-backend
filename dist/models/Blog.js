"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        avatar: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
});
exports.Blog = (0, mongoose_1.model)('Blog', BlogSchema);
