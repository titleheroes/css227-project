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
    User = require('../models/user');

// ------------------ ADMIN ------------------

router.get('/admin', middleware.checkAdmin, function (req, res) {
    User.find({ priority: 'user' }, function (err, allUser) {
        if (err) {
            console.log(err);
        } else {
            res.render('./index/admin.ejs', { User: allUser });
        }
    });
});

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

router.get('/:id', middleware.checkProfileOwner, function (req, res) {
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

router.post('/:id', middleware.checkProfileOwner, upload.single('image'), function (req, res){
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

module.exports = router;