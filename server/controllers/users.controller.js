"use strict"
const { User } = require('../models/user.model');
const cloudinary = require('cloudinary');

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

const UploadImage = (req, res) => {
    console.log(req.files);
    
    cloudinary.uploader.upload(req.files.file.path,(result)=>{
        console.log(result);
        res.status(200).send({
            public_id: result.public_id,
            url: result.url
        })
    },{
        public_id: `${Date.now()}`,
        resource_type: 'auto'
    })
}

const RemoveImage = (req, res) => {
    let image_id = req.query.public_id;

    cloudinary.uploader.destroy(image_id,(error,result)=>{
        if(error) return res.json({succes:false,error});
        res.status(200).send('ok');
    })
}

module.exports = {
    UserRegister,
    UserLogin,
    UserLogout,
    UserAuth,
    UploadImage,
    RemoveImage
}
