const debug = require('debug')('back-end')
const logger = require('morgan')
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const formidable = require('express-formidable');
const cloudinary = require('cloudinary');

const userRoute = require('./routes/users.route');
const brandRoute = require('./routes/brands.route');
const woodRoute = require('./routes/woods.route');
const productRoute = require('./routes/products.route');

const errorHandler = require('./_helpers/error-handler')
const fatalErrorHandler = require('./_helpers/fatal-error-handler')

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE)

const app = express();
app.use(logger('dev'))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin, Access-Control-Allow-Request-Method");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
})

app.use('/api', [userRoute, brandRoute, woodRoute, productRoute]);

app.use((err, req, res, next) => {
    debug(`Error: ${err.message}`)
    if (err.message.match(/not found/)) {
        return res.status(404).send({
            error: err.message
        })
    }
    res.status(500).send({
        error: err.message
    })
})

app.use(errorHandler)
app.use(fatalErrorHandler)
process.on('uncaughtException', fatalErrorHandler)
process.on('unhandledRejection', fatalErrorHandler)

module.exports = app;