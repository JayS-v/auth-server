/*
ISC License

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

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