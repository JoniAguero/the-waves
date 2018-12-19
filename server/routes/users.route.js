"use strict"

var express = require('express');

var UserController = require('../controllers/users.controller');
// var authorizationToken = require('../token/aut.js')

var api = express.Router();

api.get("/prueba", UserController.pruebaUsuario);

module.exports = api;
