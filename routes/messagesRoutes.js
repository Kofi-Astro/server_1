const express = require('express');
const router = express.Router();
const Message = require('../models/message');


// Create a new message
router.post('/send_messages', async (req, res) => {
    try {
        const { content, sender, recipient, timestamp, attachment } = req.body;
        const newMessage = new Message({
            content,
            sender,
            recipient,
            timestamp,
            media,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.error('Message creation error: ', error);
    }
});


// Get all messages of current user(sender)
router.get('/fetch_messages/:sender', async (req, res) => {
    try {
        const sender = req.params.sender;
        const messages = await Message.find({

            sender,

        }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
        console.log('Error getting message for ', $sender, error);
    }
});


module.exports = router;
















