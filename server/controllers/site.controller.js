"use strict"
const { Site } = require('../models/site.model');

const UpdateSite = (req, res) => {
    Site.findOneAndUpdate(
        { name: 'Site'},
        { "$set": { siteInfo: req.body }},
        { new: true },
        (err, doc )=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true,
                siteInfo: doc.siteInfo
            })
        }
)
}

const GetSite = (req, res) => {

    Site.find({}, (err, site) => {

        if (err) return res.status(400).send(err);
        res.status(200).send(site[0].siteInfo)
    });
}

module.exports = {
    UpdateSite,
    GetSite
}
