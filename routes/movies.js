var express = require('express'),
    router  = express.Router(),
    Movies  = require('../models/movies');
    Cinemas = require('../models/cinema');
    User    = require('../models/user');
    Liked   = require('../models/liked');

router.get('/', function(req,res){
    Movies.find({}, function(err, allMovies){
        if(err){
            console.log(err);
        } else {
            res.render('./movies/movies.ejs', {Movies: allMovies, sort: 'All'});
        }
    });
});

router.get('/new', function(req,res){
    res.render('./movies/new.ejs');
});

//  Genre
router.get('/genre/:genre', function(req,res){
    Movies.find({genre: new RegExp(req.params.genre, 'i')}, function(err, foundMovies){
        if(err){
            console.log(err);
        } else {
            res.render('./movies/movies.ejs', {Movies: foundMovies, sort: req.params.genre});
        }
    });
});

//  Search
router.post('/search', function(req,res){
    var name = req.body.search;
    res.redirect('/movies/search/' + name);
});

router.get('/search/:name', function(req,res){
    Movies.find({name: new RegExp(req.params.name, 'i')}, function(err, foundMovies){
        if(err){
            console.log(err);
        } else {
            res.render('./movies/movies.ejs', {Movies: foundMovies, sort: req.params.name});
        }
    });
});

//  Show
router.get('/:id', function(req,res){
    Movies.findById(req.params.id).populate('comments').exec(function(err, foundMovies){
        if(err){
            console.log(err);
        } else {
            Cinemas.find({}, function(err, allCinemas){
                if(err){
                    console.log(err);
                } else {
                    if(req.isAuthenticated()){
                        User.findById(req.user._id).exec(function(err, foundUsers){
                            if(err){
                                console.log(err);
                            } else {
                                res.render('./movies/show.ejs', {Movies: foundMovies, Cinemas: allCinemas, User: foundUsers});
                            }
                        });
                    } else {
                        res.render('./movies/show.ejs', {Movies: foundMovies, Cinemas: allCinemas});
                    }
                }
            });
        }
    });
});

router.post('/:id/like', isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUsers){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            Liked.create({}, function(err, like){
                if(err){
                    console.log(err);
                } else {
                    Movies.findById(req.params.id, function(err, foundMovies){
                        if(err){
                            console.log(err);
                        } else {
                            like.movies.id      = req.params.id;
                            like.movies.logo    = foundMovies.logo;
                            like.movies.banner    = foundMovies.banner;
                            like.save();
                            foundUsers.likes.push(like);
                            foundUsers.save();
                            res.redirect('back');
                        }
                    });
                }
            });
        }
    });
});

router.post('/:id/unlike', isLoggedIn, function(req, res){
    User.update( {_id: req.user._id}, { $pull: { likes: req.params.id } } ).exec(function(err){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            Liked.findByIdAndRemove(req.params.id, function(err){
                if(err){
                    console.log(err);
                } else {
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