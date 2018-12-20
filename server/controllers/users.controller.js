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
    console.log('UserLogin');
    console.log(req.body);
    
    User.findOne({'email': req.body.email}, (err, user) => {
        if(!user) return res.json({success:false, message: 'Auth failed. Email not found.'});
        user.comparePassword(req.body.password, (err, isMatch)=>{
            console.log('isMatch');
            if(!isMatch) return res.json({success:false, message: 'Wrong password'});
            user.generateToken((err, user)=>{
                if(err) return res.status(400).send(err);
                console.log('generateToken');
                console.log(user.token);
                
                res.cookie('w_auth', user.token).status(200).json({
                    success: true
                })
            })
        })
    })
}

const UserLogout = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id},
        {token: ''},
        (err, doc) => {
            if(err) return res.json({success: false, err});
            return res.status(200).send({
                success: true
            })
        }
    )
}

const UserAuth = (req, res) => {
    console.log('UserAuth', res);
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })
}

module.exports = {
    UserRegister,
    UserLogin,
    UserLogout,
    UserAuth
}
