"use strict"

const { User } = require('../models/user.model');

const UserRegister = (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
        if(err) return res.json({success:false, err});
        res.status(200).json({
            success: true,
            userdata: doc
        })
    })
}

module.exports = {
    UserRegister
}
