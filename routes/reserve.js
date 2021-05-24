var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    passport    = require('passport'),
    Session     = require('../models/session'),
    Movies      = require('../models/movies'),
    Cinemas     = require('../models/cinema'),
    User        = require('../models/user');

router.get('/:cid/:mid', isLoggedIn, function(req, res){
    Cinemas.findById(req.params.cid, function(err, foundCinemas){
        if(err){
            console.log(err);
        } else {
            Movies.findById(req.params.mid, function(err, foundMovies){
                if(err){
                    console.log(err);
                } else {
                    res.render('reserve/reserve.ejs', {Cinemas: foundCinemas, Movies: foundMovies});
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