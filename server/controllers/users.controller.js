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

const UserLogin = (req, res) => {
    User.findOne({'email': req.body.email}, (err, user) => {
        if(!user) return res.json({success:false, message: 'Auth failed. Email not found.'});
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch) return res.json({success:false, message: 'Wrong password'});
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                res.cookie('w_auth', user.token).status(200).json({
                    success: true
                })
            })
        })
    })
}

module.exports = {
    UserRegister,
    UserLogin
}
