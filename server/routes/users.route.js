"use strict"

var express = require('express');

var UserController = require('../controllers/users.controller');
var auth = require('../middlewares/auth')

var userRoute = express.Router();

userRoute.post("/users/register", UserController.UserRegister);
userRoute.post("/users/login", UserController.UserLogin);
userRoute.get("/users/auth", auth, UserController.UserAuth);

module.exports = userRoute;
