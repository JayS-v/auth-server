"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    HOST: process.env.HOST || 'localhost',
    DB_URL: process.env.DB_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
exports.default = config;
