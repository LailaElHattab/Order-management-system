require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('./api/helpers/logger');
const routes = require('./api/controller/routes');


//configure express 
const app = express()
app.use(cors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    credentials: true,
    maxAge: 60,
    exposedHeaders: ['Content-Disposition']
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);


//connect to mongodb
mongoose.connect(process.env.MONGODB_URL);
mongoose.connection
    .once('connected', () => logger.info('Connected to MongoDb!'))
    .on('error', (error) => {
        logger.error('Could not connect to MongoDb!', { error });
    });


// start express server
app.listen(3001, () => logger.info('order-api listening on port 3001!'));