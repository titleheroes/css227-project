var express = require('express'),
    router  = express.Router(),
    middleware = require('../middleware'),
    Cinemas  = require('../models/cinema');
    User    = require('../models/user');

router.get('/', function(req,res){
    Cinemas.find({}, function(err, allCinemas){
        if(err){
            console.log(err);
        } else {
            res.render('./cinema/cinema.ejs', {Cinemas: allCinemas});
        }
    });
});

//  Show
router.get('/:id', function(req,res){
    Cinemas.findById(req.params.id).exec(function(err, foundCinemas){
        if(err){
            console.log(err);
        } else {
            Movies.find({}, function(err, allMovies){
                if(err){
                    console.log(err);
                } else {
                    res.render('./cinema/show.ejs', {Movies: allMovies, Cinemas: foundCinemas});
                }
            });
        }
    });
});

module.exports = router;