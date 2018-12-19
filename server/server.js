const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser') ;
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE)

const app = express ();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 1234;

app.listen(port, () => {
    console.log(`Server Running on port ${chalk.green(`${port}`)}`)
})