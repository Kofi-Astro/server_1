const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    lowerId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    higherId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    messages: [],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Chats = mongoose.model('Chats', chatSchema);

module.exports = Chats;