var express = require('express'),
    router = express.Router(),
    multer = require('multer'),
    path = require('path'),
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
    User = require('../models/user');

// ------------------ ADMIN ------------------

router.get('/admin', isLoggedIn, function (req, res) {
    User.find({ priority: 'user' }, function (err, allUser) {
        if (err) {
            console.log(err);
        } else {
            res.render('./index/admin.ejs', { User: allUser });
        }
    });
});

router.post('/admin/grant/:id', isLoggedIn, function (req, res) {
    if (req.user.priority == 'admin') {
        User.findByIdAndUpdate(req.params.id,
            {
                priority: 'admin'
            },
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated User : ", result);
                    res.redirect('back');
                }
            });
    }
    else { res.rendirect('back'); }
});

router.post('/admin/delete/:id', isLoggedIn, function (req, res) {
    if (req.user.priority == 'admin') {
        User.findByIdAndDelete(req.params.id, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Deleted User : ", result);
                res.redirect('back');
            }
        });
    }
    else { res.rendirect('back'); }
});

// ------------- END OF ADMIN ----------------

router.get('/:id', isLoggedIn, function (req, res) {
    User.findById(req.params.id).exec(function (err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            User.findById(req.params.id).populate('likes').exec(function(err, likedMovies){
                if (err) {
                    console.log(err);
                } else {
                    res.render('./index/profile.ejs', { User: foundUsers, Movies: likedMovies });
                }
            });
        }
    });
});

router.post('/:id', isLoggedIn, upload.single('image'), function (req, res) {
    User.findByIdAndUpdate(req.params.id,
        {
            picture: '/images/user/' + req.file.filename
        },
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("Updated User : ", result);
                res.redirect('back');
            }
        });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};



module.exports = router;