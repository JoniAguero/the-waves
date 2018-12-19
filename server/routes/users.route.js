"use strict"

var express = require('express');

var UserController = require('../controllers/users.controller');
// var authorizationToken = require('../token/aut.js')

var api = express.Router();

api.post("/users/register", UserController.UserRegister);
api.post("/users/login", UserController.UserLogin);

module.exports = api;
