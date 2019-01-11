"use strict"
const { Product } = require('../models/product.model');
const mongoose = require('mongoose');

const CreateProduct = (req, res) => {
    const product = new Product(req.body);

    product.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            article: doc
        })
    })
}

const CreateProductShop = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100; 
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for(let key in req.body.filters){
        if(req.body.filters[key].length >0 ){
            if(key === 'price'){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    findArgs['publish'] = true;

    Product.
        find(findArgs).
        populate('brand').
        populate('wood').
        sort([[sortBy,order]]).
        skip(skip).
        limit(limit).
        exec((err,articles)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({
                size: articles.length,
                articles
            })
        })
}

const GetProducts = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100;

    Product.
        find().
        populate('brand').
        populate('wood').
        sort([[sortBy,order]]).
        limit(limit).
        exec((err,articles)=>{
            if(err) return res.status(400).send(err);
            res.send(articles)
        })
}

const GetProductsById = (req, res) => {
    let type = req.query.type;
    let items = req.query.id;

    if(type === "array"){
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map(item=>{
            return mongoose.Types.ObjectId(item)
        })
    }

    Product.
        find({ '_id':{$in:items}}).
        populate('brand').
        populate('wood').
        exec((err,docs)=>{
            return res.status(200).send(docs)
    })
}

module.exports = {
    CreateProduct,
    CreateProductShop,
    GetProducts,
    GetProductsById
}
