const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    extra: {
        type: String
    },
    time: {
        type: String
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
