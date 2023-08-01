// const User = require('../models/user');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;


class UserRepository {
    async create({ email, username, password }) {

        await User.create({
            email,
            username,
            password,

        });
    }

    async findbUsername(username) {
        return await User.findOne({ username }).select({ 'email': 1, 'username': 1, 'password': 1 });
    }

    async getUsersWhereNot(userId) {
        return await User.find({ _id: { $ne: new ObjectId(userId) } });
    }
}

const userRepository = new UserRepository();

module.exports = userRepository;