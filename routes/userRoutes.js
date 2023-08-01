const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user');


// Route to log in a user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        //Find user by their username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        //Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // At this point, the user is authenticated.
        // Generate a token or set a session to maintain the login state.



        return res.json({ message: 'Logged in successfully', user });
    } catch (error) {
        console.error('Error during login: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Route to fetch users excluding the requester
router.get('/fetch-users', async (req, res) => {
    try {



        const users = await User.find();

        res.json(users);
    } catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;



