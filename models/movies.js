var mongoose = require('mongoose');

var moviesSchema = new mongoose.Schema({
    name: String,

    //  Media
    image: String,
    logo: String,
    banner: String,
    trailer: String,

    //  Desc
    genre: String,
    director: String,
    date: String,
    runtime: String,
    score: Number,

    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
});

module.exports = mongoose.model('movies', moviesSchema);