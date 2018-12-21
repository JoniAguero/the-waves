"use strict"

var express = require('express');

var SiteController = require('../controllers/site.controller');
var auth = require('../middlewares/auth');
var admin = require('../middlewares/admin');

var siteRoute = express.Router();

siteRoute.post('/site/site_data', [auth, admin], SiteController.UpdateSite);
siteRoute.get('/site/site_data', SiteController.GetSite);

module.exports = siteRoute;
