var mongoose = require('mongoose');

var reserveSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String,
    },

    seats: [String],

});

module.exports = mongoose.model('reserve', reserveSchema);