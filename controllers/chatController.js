const ChatRepository = require('../repositories/chatRepository');
const ObjectId = require('mongoose').Types.ObjectId;
const Dates = require('../utils/dates');
const shared = require('../shared/index');

class ChatController {
    async getChatByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const myId = req._id;

            const lowerId = userId < myId ? userId : myId;
            const higherId = userId > myId ? userId : myId;

            let chat = await ChatRepository.getChatByUsersId({
                lowerId,
                higherId
            });

            if (!chat) {
                chat = await ChatRepository.create({
                    lowerId,
                    higherId
                });
                chat = await ChatRepository.getChatById(chat._id);
            }

            return res.json({
                chat
            });

        } catch (error) {
            console.error(error);
            return res.json({
                error: true,
                errorMessage: "Error occured: ", error
            });
        }
    }

    async getChats(req, res) {
        // console.log('Entry into getChats')00
        try {
            const myId = req._id;
            console.log('myId', myId);
            const chats = await ChatRepository.getUserChats(myId);
            return res.json({ chats });

        } catch (error) {
            console.error(error);
            return res.json({
                error: true,
                errorMessage: error
            });

        }
    }


    async sendMessage(req, res) {
        try {

            const chatId = req.params.chatId;
            const myId = req._id;
            const { text } = req.body;

            if (!text || !text.trim()) {
                return res.json({
                    error: true,
                    errorMessage: "Message sending failed"
                });
            }

            const chat = await ChatRepository.getChatById(chatId);
            const datetime = Dates.getDateTime();
            const messageId = new ObjectId();
            // chat.messages.push({
            const message = {
                _id: messageId,
                userId: new ObjectId(myId),
                text,
                createdAt: datetime
            };

            chat.messages.push(message);
            const users = shared.users;
            const findUsers = users.filter(user => (user._id == chat.lowerId._id || user._id == chat.higherId._id) && user._id != myId);
            console.log("findUsers: ", findUsers);
            findUsers.forEach(user => {
                console.log('Issuing user with socket: ', user.socket.id);
                console.log('Issuing', {
                    ...chat,
                    messages: chat.messages,
                })
                user.socket.emit('message', {
                    ...chat,
                    // messages,
                    messages: chat.messages,
                });
                user.socket.emit('message', chat);
            });
            // console.log('chat now: ', chat);
            chat.save();
            return res.json({
                chat
            });

        } catch (error) {
            console.error(error);
            return res.json({
                error: true,
                errorMessage: error
            });

        }
    }
}

const chatController = new ChatController();

module.exports = chatController;