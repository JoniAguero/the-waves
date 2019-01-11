"use strict"

const express = require('express');

const UserController = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const formidable = require('express-formidable');

const userRoute = express.Router();

userRoute.post("/users/register", UserController.UserRegister);
userRoute.post("/users/login", UserController.UserLogin);
userRoute.post("/users/uploadimage", [auth, admin, formidable()], UserController.UploadImage);
userRoute.post("/users/addToCart", auth, UserController.addToCart);
userRoute.post("/users/successBuy", auth, UserController.successBuy);
userRoute.post("/users/update_profile", auth, UserController.updateProfile);
userRoute.get("/users/auth", auth, UserController.UserAuth);
userRoute.get("/users/logout", auth, UserController.UserLogout);
userRoute.get("/users/removeimage", auth, UserController.RemoveImage);
userRoute.get("/users/removeFromCart", auth, UserController.removeFromCart);

module.exports = userRoute;
