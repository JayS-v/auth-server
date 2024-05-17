import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    HOST: process.env.HOST || 'localhost',
    DB_URL: process.env.DB_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};

export default config;