var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    time: String,
    seats: {
        type: Array,
        default: [  [ 0, 0, 0, 0 ]
                   ,[ 0, 0, 0, 0 ] ],
    },
    seatsAvailable: {
        type: Number,
        default: 8,
    },
     
    cinema: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cinema'
        },
    },
    movies: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'movies'
        },
    },
    reservation: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reserve'
        },
    },
});

module.exports = mongoose.model('session', sessionSchema);