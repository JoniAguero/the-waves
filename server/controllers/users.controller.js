"use strict"
const { User } = require('../models/user.model');
const { Payment } = require('../models/payment.model');
const { Product } = require('../models/product.model');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
const async = require('async');

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
    
    cloudinary.uploader.upload(req.files.file.path,(result)=>{

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
const removeFromCart = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.user._id },
        { "$pull":
            { "cart": {"id":mongoose.Types.ObjectId(req.query._id)} }
        },
        { new: true },
        (err,doc)=>{
            let cart = doc.cart;
            let array = cart.map(item=>{
                return mongoose.Types.ObjectId(item.id)
            });

            Product.
            find({'_id':{ $in: array }}).
            populate('brand').
            populate('wood').
            exec((err,cartDetail)=>{
                return res.status(200).json({
                    cartDetail,
                    cart
                })
            })
        }
    );
}

const addToCart = (req, res) => {

    User.findOne({_id: req.user._id},(err,doc)=>{
        let duplicate = false;
        doc.cart.forEach((item)=>{
            if(item.id == req.query.productId){
                  duplicate = true;  
            }
        })
        if(duplicate){    
            User.findOneAndUpdate(
                {_id: req.user._id, "cart.id":mongoose.Types.ObjectId(req.query.productId)},
                { $inc: { "cart.$.quantity":1 } },
                { new:true },
                ()=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json(doc.cart)
                }
            )
        } else {
            User.findOneAndUpdate(
                {_id: req.user._id},
                { $push:{ cart:{
                    id: mongoose.Types.ObjectId(req.query.productId),
                    quantity:1,
                    date: Date.now()
                } }},
                { new: true },
                (err,doc)=>{
                    if(err) return res.json({success:false,err});
                    res.status(200).json(doc.cart)
                }
            )
        }
    })
}

const successBuy = (req, res) => {
    let history = [];
    let transactionData = {}

    // user history
    req.body.cartDetail.forEach((item)=>{

        history.push({
            dateOfPurchase: Date.now(),
            name: item.name,
            brand: item.brand.name,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })


    // PAYMENTS DASH
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData;
    transactionData.product = history;
        
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push:{ history:history }, $set:{ cart:[] } },
        { new: true },
        (err,user)=>{
            if(err) return res.json({success:false,err});

            const payment = new Payment(transactionData);
            payment.save((err,doc)=>{
                if(err) return res.json({success:false,err});
                let products = [];
                doc.product.forEach(item=>{
                    products.push({id:item.id,quantity:item.quantity})
                 })
              
                async.eachSeries(products,(item,callback)=>{ 
                    Product.update(
                        {_id: item.id},
                        { $inc:{
                            "sold": item.quantity
                        }},
                        {new:false},
                        callback
                    )
                },(err)=>{
                    if(err) return res.json({success:false,err})
                    res.status(200).json({
                        success:true,
                        cart: user.cart,
                        cartDetail:[]
                    })
                })
            });
        }
    )
}

module.exports = {
    UserRegister,
    UserLogin,
    UserLogout,
    UserAuth,
    UploadImage,
    RemoveImage,
    addToCart,
    removeFromCart,
    successBuy
}
