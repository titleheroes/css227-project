var Movies      = require('../models/movies'),
    Comment     = require('../models/comment'),
    User        = require('../models/user');

var middlewareObj = {};

middlewareObj.checkProfileOwner = function(req, res, next){
    if(req.isAuthenticated()){
        if( req.user._id.equals(req.params.id) ){
            return next();
        }
    } else {
        res.redirect('back');
    }
};

middlewareObj.checkAdmin = function(req, res, next){
    if(req.isAuthenticated()){
        User.findById(req.user._id, function(err, currentUser){
            if(err){
                res.redirect('back');
            } else {
                if( currentUser.priority == 'admin' ){
                    return next();
                }
            }
        });
    } else {
        res.redirect('back');
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = middlewareObj;