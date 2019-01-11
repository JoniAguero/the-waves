"use strict"

var express = require('express');

var WoodController = require('../controllers/woods.controller');
var auth = require('../middlewares/auth');
var admin = require('../middlewares/admin');

var woodRoute = express.Router();

woodRoute.post('/product/wood', [auth, admin], WoodController.CreateWood);
woodRoute.get('/product/woods', WoodController.GetWoods);

module.exports = woodRoute;
