const { User } = require('./../models/user.model')

module.exports = auth

function auth(req, res, next) {
    let token = req.cookies.w_auth;
    console.log('auth', token);
    
    User.findByToken(token, (err, user) => {
        console.log(err);
        console.log(user);
        
        
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true
        })

        req.token = token;
        req.user = user;
        next();
    })
}