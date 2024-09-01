const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const UserSchema = mongoose.Schema({
    userName: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        required: true
    },
    googleId: { type: String,unique: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});




UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', UserSchema)