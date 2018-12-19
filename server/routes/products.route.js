"use strict"

var express = require('express');

var ProductController = require('../controllers/products.controller');
var auth = require('../middlewares/auth');
var admin = require('../middlewares/admin');

var productRoute = express.Router();

productRoute.post('/product/article', [auth, admin], ProductController.CreateProduct);
productRoute.get('/product/articles', ProductController.GetProducts);
productRoute.get('/product/articles_by_id', ProductController.GetProductsById);

module.exports = productRoute;
