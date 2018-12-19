"use strict"
const { Wood } = require('../models/wood.model');

const CreateWood = (req, res) => {
    const wood = new Wood(req.body);

    wood.save((err,doc)=>{
        if(err) return res.json({success:false,err});
        res.status(200).json({
            success: true,
            wood: doc
        })
    })
}

const GetWoods = (req, res) => {
    Wood.find({}, (err, woods) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(woods)
    })
}

module.exports = {
    CreateWood,
    GetWoods
}
