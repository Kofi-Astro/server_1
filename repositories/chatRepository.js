const Chat = require('../models/chat');
const ObjectId = require('mongoose').Types.ObjectId;

class ChatRepository {

    async create({ lowerId, higherId }) {
        return await Chat.create({
            lowerId: new ObjectId(lowerId),
            higherId: new ObjectId(higherId),
            messages: [],
        });
    }

    async getChatByUsersId({ lowerId, higherId }) {
        return await Chat.findOne({
            lowerId: new ObjectId(lowerId),
            higherId: new ObjectId(higherId)
        }).populate('lowerId').populate('higherId');
    }

    async getChatById(chatId) {
        // return await Chat.findOne({ _id: ObjectId(chatId) });
        return await Chat.findOne({
            _id: new ObjectId(chatId)
        }).populate('lowerId').populate('higherId');
    }

    async getUserChats(userId) {
        return await Chat.find({
            $or: [
                { 'lowerId': new ObjectId(userId) },
                { 'higherId': new ObjectId(userId) }
            ]
        }).populate('lowerId').populate('higherId');
    }

    async updateChatMessages(chatId, messages) {
        return await Chat.findByIdAndUpdate(chatId, {
            $set: { messages }
        });
    }
}

const chatRepository = new ChatRepository();

module.exports = chatRepository;