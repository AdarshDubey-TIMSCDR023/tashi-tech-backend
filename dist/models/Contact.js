"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;

const mongoose_1 = require("mongoose");

const ContactSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    service: {
        type: String,
        trim: true,
    },
    budget: {
        type: String,
        trim: true,
    },
    subject: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

exports.Contact = (0, mongoose_1.model)("Contact", ContactSchema);
