const reserve = require('../models/reserve');

var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    passport    = require('passport'),
    middleware = require('../middleware'),
    Session     = require('../models/session'),
    Reserve     = require('../models/reserve'),
    Movies      = require('../models/movies'),
    Cinemas     = require('../models/cinema');

router.get('/:id', middleware.isLoggedIn, function(req, res){
    Session.findById(req.params.id, function(err, foundSession){
        if(err){
            console.log(err);
        } else {
            Cinemas.findById(foundSession.cinema, function(err, foundCinemas){
                if(err){
                    console.log(err);
                } else {
                    Movies.findById(foundSession.movies, function(err, foundMovies){
                        if(err){
                            console.log(err);
                        } else {
                            res.render('reserve/reserve.ejs', {Session: foundSession, Cinemas: foundCinemas, Movies: foundMovies});
                        }
                    });
                }
            });
        }
    });
});

router.post('/:id', middleware.isLoggedIn, function(req, res){
    Session.findById(req.params.id, function(err, foundSession){
        if(err){
            console.log(err);
        } else {
            Reserve.create(req.body.reserve, function(err, reserve){
                if(err){
                    console.log(err);
                } else {
                    reserve.user.id = req.user._id;
                    reserve.user.username = req.user.username;
                    reserve.save();
                    foundSession.reservation.push(reserve);
                    foundSession.save();

                    if( req.body.A1 == 'y') {
                        reserveSeat('A1', reserve._id);
                    }
                    if( req.body.A2 == 'y') {
                        reserveSeat('A2', reserve._id);
                    }
                    if( req.body.A3 == 'y') {
                        reserveSeat('A3', reserve._id);
                    }
                    if( req.body.A4 == 'y') {
                        reserveSeat('A4', reserve._id);
                    }
                    if( req.body.B1 == 'y') {
                        reserveSeat('B1', reserve._id);
                    }
                    if( req.body.B2 == 'y') {
                        reserveSeat('B2', reserve._id);
                    }
                    if( req.body.B3 == 'y') {
                        reserveSeat('B3', reserve._id);
                    }
                    if( req.body.B4 == 'y') {
                        reserveSeat('B4', reserve._id);
                    }

                    res.redirect('/user/' + req.user._id + '/ticket');
                    
                }
            });
        }
    });
    
    function reserveSeat(seat, reserve) {
        Session.findByIdAndUpdate(req.params.id, { $pull: { seats: seat } }, function(err, foundSession){
            if(err){
                console.log(err);
            } else {
                Reserve.findByIdAndUpdate(reserve._id, { $push: { seats: seat } }, function(err, foundReserve) {
                    if(err){
                        console.log(err);
                    } else {
                        console.log('Reserve Seat : ' + seat);
                    }
                });
            }
        });
    }
});

module.exports = router;