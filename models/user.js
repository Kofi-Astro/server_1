const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = mongoose.Schema({
    email: {
        type: String, required: true,
    },
    username: {
        type: String, required: true,
    },
    password: {
        type: String, required: true, select: false,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },

});


// Hash password before saving
userSchema.pre('save', async function (next) {
    try {

        if (!this.isModified('password')) {
            return next(); // If no changes were made in this update operation then skip hashing of  password and
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;

































// //Define user schema
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true },
//     password: { type: String, required: true },
// });

// // Hash password before saving
// userSchema.pre('save', async function (next) {
//     try {

//         if (!this.isModified('password')) {
//             return next(); // If no changes were made in this update operation then skip hashing of  password and
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(this.password, salt);
//         this.password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;