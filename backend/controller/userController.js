
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json("This user doesn’t exist");
        console.log(user, req.body.password);

        const isMatch = await user.matchPassword(req.body.password);
        if (!isMatch) return res.status(400).json("wrong password");
        const token = jwt.sign({ id: user._id, email: user.email }, "collo");
        const { password, ...otherDetails } = user._doc;
        res.status(200).json({ user: { ...otherDetails, token } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const userRegister = async (req, res) => {
    const { userName, email, password, role } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) return res.status(200).json("This user already exist");
        const passwordHash = await bcrypt.hash(password, 10);
        const saveUser = await User.create({
            userName,
            email,
            role,
            password: passwordHash,
        });
        await saveUser.save();
        res.status(200).json("User created");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found");

        const { password, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, userRegister, getUserDetails }
