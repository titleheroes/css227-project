var express     = require('express'),
    router      = express.Router({mergeParams: true}),
    passport    = require('passport'),
    middleware = require('../middleware');

router.get('/:id', middleware.isLoggedIn, function(req, res){
    res.render('reserve/reserve.ejs');
});

module.exports = router;