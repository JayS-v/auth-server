// const express = require('express')
import express, { Express, Request, Response } from "express";
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config';
import authRouter from './auth/authRouter';
import dotenv from "dotenv";
dotenv.config();

//test
async function startServer(): Promise<void> {
    try {
        if (!config.DB_URL) {
            throw new Error("DB_URL is not defined");
        }

        await mongoose.connect(config.DB_URL);

        const app: Express = express();

        // Middleware 
        app.use(express.json());
        app.use(fileUpload({}))
        app.use(cors({ origin: config.CORS_ORIGIN }));
        app.use(express.static('static'))
        app.use(cookieParser());

        //Routes
        app.use('/auth', authRouter)
        app.get('/', (req: Request, res: Response) => {
            res.send('server is running');
        });
        app.use((req: Request, res: Response) => {
            res.status(404).send('Not Found');
        });

        app.listen(config.PORT, config.HOST, () => {
            console.log(`my server started on http://${config.HOST}:${config.PORT}`);
        });

    } catch (error) {
        console.log(error)
    }
}

startServer()