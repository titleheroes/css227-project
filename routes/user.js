var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
    middleware = require('../middleware'),
    storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './public/images/user/');
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
    upload = multer({ storage: storage, fileFilter: imageFilter }),

    Session     = require('../models/session'),
    Reserve     = require('../models/reserve'),
    User        = require('../models/user');

// ------------------ ADMIN ------------------

router.get('/admin', middleware.checkAdmin, function (req, res) {
    User.find({ priority: 'user' }, function (err, allUser) {
        if (err) {
            console.log(err);
        } else {
            User.find({ priority: 'admin' }, function (err, allAdmin) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('./user/admin.ejs', { User: allUser, Admin: allAdmin });
                }
            });
        }
    });
});

//  Grant Admin
router.post('/admin/grant/:id', middleware.checkAdmin, function (req, res) {
    User.findByIdAndUpdate(req.params.id,{priority: 'admin'},function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated User : ", result);
            res.redirect('back');
        }
    });
});
// End of Grant Admin

// Forfeit Admin
router.post('/admin/forfeit/:id', middleware.checkAdmin, function (req, res) {
    User.findByIdAndUpdate(req.params.id,{priority: 'user'},function (err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Updated User : ", result);
            res.redirect('back');
        }
    });
});
// End of Forfeit Admin

router.post('/admin/delete/:id', middleware.checkAdmin, function (req, res) {
    User.findByIdAndDelete(req.params.id, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted User : ", result);
            res.redirect('back');
        }
    });
});

// ------------- END OF ADMIN ----------------

router.get('/:id/ticket', middleware.checkProfileOwner, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            Reserve.find({'user.id': req.params.id}).sort({boughtTime: -1}).exec(function(err, descendingReserve){
                if (err) {
                    console.log(err);
                } else {
                    Reserve.find({'user.id': req.params.id}).sort({boughtTime: 1}).exec(function(err, ascendingReserve){
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('./user/ticket.ejs', { User: foundUsers, descendingReserve: descendingReserve, ascendingReserve: ascendingReserve });
                        }
                    });
                }
            });
        }
    });
});

// ------------------ Profile ------------------
router.get('/:id', middleware.checkProfileOwner, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            User.findById(req.params.id).populate('likes').exec(function(err, likedMovies){
                if (err) {
                    console.log(err);
                } else {
                    res.render('./user/profile.ejs', { User: foundUsers, Movies: likedMovies });
                }
            });
        }
    });
});

//  Change profile pic
router.post('/:id', middleware.checkProfileOwner, upload.single('image'), function (req, res){
    if ( req.file ){
        User.findByIdAndUpdate(req.params.id,
            {
                picture: '/images/user/' + req.file.filename
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                    req.flash('error', err.message);
                } else {
                    console.log("Updated User : ", result);
                    req.flash('success', 'Change picture profile');
                    res.redirect('back');
                }
            });
    }
    else {
        res.redirect('back');
    }
});
//  End of Change profile pic

// ------------- END OF Profile ----------------

module.exports = router;