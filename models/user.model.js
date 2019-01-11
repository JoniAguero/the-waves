const moongose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SALT_I = 10;
require('dotenv').config()

const userSchema = moongose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    lastname: {
        type: String,
        required: true,
        maxlength: 50
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
})

userSchema.methods.comparePassword = function(cpassword, callback){
    bcrypt.compare(cpassword, this.password, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function(callback) {
    const user = this;
    const token = jwt.sign(user._id.toHexString(), process.env.SECRET)
    user.token = token;
    
    user.save(function(err, user){
        if(err) return callback(err);
        callback(null, user)
    })
}

userSchema.statics.findByToken = function (token, callback) {
    const user = this;
    jwt.verify(token, process.env.SECRET, function(err, decode){
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return callback(err);
            callback(null, user);
        })
    })
}

userSchema.pre('save', function(next){
    const user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

const User = moongose.model('User', userSchema)
module.exports = { User };