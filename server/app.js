const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const errorHandler = require('./_helpers/error-handler')
const fatalErrorHandler = require('./_helpers/fatal-error-handler')

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE)

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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