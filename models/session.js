var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    date : String,
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
     
    cinema: String,
    movies: String,

    reservation: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reserve'
        },
    },
});

module.exports = mongoose.model('session', sessionSchema);