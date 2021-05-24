var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    passport    = require('passport')
    Movies      = require('../models/movies'),
    Comment     = require('../models/comment'),
    User        = require('../models/user');

router.post('/', isLoggedIn, function(req, res){
    Movies.findById(req.params.id, function(err, foundMovies){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.author.picture = req.user.picture;
                    comment.save();
                    foundMovies.comments.push(comment);
                    foundMovies.save();
                    res.redirect('back');
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

module.exports = router;