var express = require('express'),
    router  = express.Router(),
    multer = require('multer'),
    path = require('path'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/images/movies/uploads');
        },
        filename: function (req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        },
    }),
    imageFilter = function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
            return callback(new Error('Only JPG, jpeg, PNG and GIF image files are allowed!'), false);
        }
        callback(null, true);
    },
    upload = multer({
        storage: storage,
        fileFilter: imageFilter,
    }),

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

//  New
router.get('/new', isLoggedIn, function(req,res){
    res.render('./movies/new.ejs');
});

// 
router.post('/new', isLoggedIn, upload.fields([{ name: 'image' }, { name: 'logo' }, { name: 'banner' } ]), function(req, res){
    req.body.movies.image = '/images/movies/uploads/' + req.files['image'][0].filename;
    req.body.movies.logo = '/images/movies/uploads/' + req.files['logo'][0].filename;
    req.body.movies.banner = '/images/movies/uploads/' + req.files['banner'][0].filename;
    Movies.create(req.body.movies, function(err, newMovies){
        if(err){
            console.log(err);
        } else {
            res.redirect('/movies');
        }
    });
});
//  End of New

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