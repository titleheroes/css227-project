var express     = require('express'),
    router      = express.Router(),
    passport    = require('passport')
    Movies      = require('../models/movies'),
    User        = require('../models/user');

router.get('/', function(req, res){
    Movies.find({}, function(err, allMovies){
        if(err){
            console.log(err);
        } else {
            Movies.find().sort({score: -1}).limit(5).exec(function(err, sortMovies){
                if(err){
                    console.log(err);
                } else {
                    res.render('./index/home.ejs', {Movies: allMovies, Sort: sortMovies});
                }
            });
        }
    });
});

//  Register
router.get('/register', function(req, res){
    res.render('./index/register.ejs');
});

router.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('./index/register');
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/');
            });
        }
    });
});

//  Login
router.get('/login', function(req, res){
    res.render('./index/login.ejs');
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login'
    }), function(res, req){
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('back');
});

module.exports = router;