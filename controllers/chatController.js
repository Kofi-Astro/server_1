const ChatRepository = require('../repositories/chatRepository');
const ObjectId = require('mongoose').Types.ObjectId;
const shared = require('../shared/index');

function formatChatMessageTime(chat) {
    chat.messages = chat.messages.map(message => {
        message.createdAt = new Date(message.createAt).getTime();
        return message;
    });
    return chat;
}

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
            const formattedChat = formatChatMessageTime(chat);
            return res.json({
                chat: formattedChat
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
            const chats = await ChatRepository.getUserChats(myId);

            const formattedChats = chats.map(formatChatMessageTime);
            return res.json({ chats: formattedChats });

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
            const isLowerIdUser = chat.lowerId._id == myId;
            const messageId = new ObjectId();
            // chat.messages.push({
            const message = {
                _id: messageId,
                userId: new ObjectId(myId),
                text,
                createdAt: Date.now(),
                unreadByLowerIdUser: isLowerIdUser ? false : true,
                unreadByHigherIdUser: isLowerIdUser ? true : false,
            };

            chat.messages.push(message);
            const users = shared.users;
            const findUsers = users.filter(user => (user._id == chat.lowerId._id || user._id == chat.higherId._id) && user._id != myId);
            // console.log("findUsers: ", findUsers);
            findUsers.forEach(user => {
                // console.log('Issuing user with socket: ', user.socket.id);
                // console.log('Issuing', {
                //     ...chat,
                //     messages: chat.messages,
                // })
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


    async readChat(req, res) {
        try {
            const chatId = req.params.chatId;
            const myId = req._id;
            const chat = await ChatRepository.getChatById(chatId);
            const isLowerIdUser = chat.lowerId._id == myId;
            // console.log("lowerId : ", isLowerIdUser);
            // console.log("myId: ", myId);
            // console.log("isLowerId : ", isLowerIdUser);

            const messages = chat.messages.map(message => {
                if (isLowerIdUser) {
                    message.unreadByLowerIdUser = false;
                } else {
                    message.unreadByHigherIdUser = false;
                }
                return message;
            });

            const updatedChat = await ChatRepository.updateChatMessages(chat._id, messages);

            const formatedChat = formatChatMessageTime(updatedChat);
            return res.json({
                // chat: updatedChat
                chat: formatedChat
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