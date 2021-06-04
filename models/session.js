var mongoose = require('mongoose');

var sessionSchema = new mongoose.Schema({
    date : String,
    time: String,
    seats: {
        type: [String],
        default: [ 'A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4' ],
    },
    seatsAvailable: {
        type: Number,
        default: 8,
    },
     
    cinema: String,
    movies: String,

    reservation: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'reserve'
        },
    ],
});

module.exports = mongoose.model('session', sessionSchema);