"use strict"

var Usuario = require('../models/user.model');


function pruebaUsuario(req, res) {
    res.status(200).send({
        message: 'Probando Controlador'
    });
}

module.exports = {
    pruebaUsuario
}
