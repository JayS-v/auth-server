const express = require('express')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config');
const authRouter = require('./auth/authRouter.js')


async function startServer() {
    try {
        await mongoose.connect(config.DB_URL);

        const app = express();

        // Middleware 
        app.use(express.json());
        app.use(fileUpload({}))
        app.use(cors({ origin: config.CORS_ORIGIN }));
        app.use(express.static('static'))
        app.use(cookieParser());

        //Routes
        app.use('/auth', authRouter)
        app.get('/', (req, res) => {
            res.send('server is running');
        });
        app.use((req, res) => {
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