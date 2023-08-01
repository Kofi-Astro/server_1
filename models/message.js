const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String, required: true,
    },
    sender: {
        type: String, required: true,
    },
    recipient: {
        type: String, required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }, media: {
        type: String,
    }
});

const Message = mongoose.model('Message', messageSchema);


module.exports = Message;