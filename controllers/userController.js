const userRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwt');

function generateJwtToken(user) {
    const { _id } = user;
    return jwt.sign({
        _id,
    }, jwtConfig.secret);
}

class UserController {
    async create(req, res) {
        try {
            const { email, username, password } = req.body;
            if (!email || !username || !password) {
                return res.json({
                    error: true,
                    errorMessage: 'Invalid fields',
                })
            }

            const user = {
                email,
                username,
                password,
            }

            const userExists = (await userRepository.findbUsername(user.username)) != null;
            if (userExists) {
                return res.json({
                    error: true,
                    errorMessage: 'Username already exist',
                })
            }

            // console.log('user = ', user);
            await userRepository.create(user);
            // console.log('user created');

            const newUser = await userRepository.findbUsername(user.username);
            console.log('newUser = ', newUser);
            const token = generateJwtToken(newUser);
            user.password = undefined;

            return res.json({
                user: newUser,
                token
            })
        } catch (error) {
            return res.json({
                error: true,
                errorMessage: 'Error has occured ', error
            })
        }
    }


    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.json({ error: true, errorMessage: 'Invalid fields' })
            }
            console.log('username = ', username);
            console.log('password = ', password);
            const user = await userRepository.findbUsername(username);
            console.log('user = ', user);

            if (!user) {
                return res.json({ error: true, errorMessage: 'Invalid credentials' });
            }
            if (!await bcrypt.compare(password, user.password)) {
                return res.json({ error: true, errorMessage: 'Invalid password' });
            }

            const token = generateJwtToken(user);
            user.password = undefined;
            return res.json({
                user, token
            });


        } catch (error) {
            return res.json({
                error: true,
                error: error,
            })
        }
    }


    async getUsers(req, res) {
        try {

            const myId = req._id;
            const users = await userRepository.getUsersWhereNot(myId);
            return res.json({
                users
            });

        } catch (error) {
            return res.json({
                error: true,
                errorMessage: error
            })

        }
    }

}


const userController = new UserController();

module.exports = userController; 