var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    picture: {
        type: String,
        default: '/images/user/default.JPG'
    },
    priority: {
        type: String,
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Liked',
            autopopulate: true
        }
    ],
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('User', userSchema);