
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const crypto = require("crypto-js");
const { mailSender } = require('../middleware/mailSender');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

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

        const mailOptions = {
            from: 'joysundaran@gmail.com',
            to: email,
            subject: 'Registration Confirmation',
            html: `
          <h2>Dear ${userName},</h2>
          <p>Thank you for registering on blog Platform! We are excited to have you as part of our learning community.</p>
        `
        };
        // Send the email
        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.error('Error sending email:', error);
        //         res.status(500).send('Error sending email');
        //     } else {
        //         console.log('Email sent:', info.response);
        //         res.status(200).send('Registration email sent');
        //     }
        // });
        await mailSender(mailOptions);
        res.status(200).json("User created");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// forget password
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a reset token
        // const resetToken = crypto.randomBytes(20).toString('hex');
        const resetToken = crypto.AES.encrypt('my message', 'dtrftrft').toString();

        // Set token and expiration in user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();
        console.log(user);

        // Send email with reset link
        const resetURL = `http://localhost:3000/reset-password?token=${resetToken}&id=${user._id}`;
        const mailOptions = {
            to: user.email,
            from: 'joysundaran@gmail.com',
            subject: 'Password Reset',
            html: `
                <p>Hi ${user.userName},</p>
                <p>You requested to reset your password.</p>
                <p>Please, click the link below to reset your password:</p>
                <a href="${resetURL}" style="color: #007bff; text-decoration: none; font-weight: bold;">Reset Password</a>`,
        };
        await mailSender(mailOptions);
        // transporter.sendMail(mailOptions, (err, response) => {
        //     if (err) {
        //         console.error('There was an error: ', err);
        //     } else {
        //         res.status(200).json('Recovery email sent');
        //     }
        // });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// reset password
const resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Update the password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        const loginURL = `http://localhost:3000/`;
        const mailOptions = {
            to: user.email,
            from: 'passwordreset@example.com',
            subject: 'Password Reset Successful',
            html: `
            <p>Hi ${user.userName},</p>
            <p>Your password has been successfully reset.</p>
            <p>You can now log in to your account using the link below:</p>
            <a href="${loginURL}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Login</a>
            <p>If you did not request this change, please contact our support team immediately.</p>
        `,
        };

        await mailSender(mailOptions);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

module.exports = { loginUser, userRegister, getUserDetails, forgetPassword, resetPassword }
