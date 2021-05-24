var mongoose = require('mongoose');

var cinemaSchema = new mongoose.Schema({
    name: String,
    slogan: String,

    //  Media
    image: String,
    logo: String,
});

module.exports = mongoose.model('cinema', cinemaSchema);