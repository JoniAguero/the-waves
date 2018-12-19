"use strict"
const { Product } = require('../models/product.model');

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
    GetProducts,
    GetProductsById
}
