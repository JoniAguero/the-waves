"use strict"

var express = require('express');

var BrandController = require('../controllers/brands.controller');
var auth = require('../middlewares/auth');
var admin = require('../middlewares/admin');

var brandRoute = express.Router();

brandRoute.post('/product/brand', [auth, admin], BrandController.CreateBrand);
brandRoute.get('/product/brands', BrandController.GetBrands);

module.exports = brandRoute;
