const express = require('express');
const router = express.Router();
const { loginUser, userRegister, getUserDetails, forgetPassword, resetPassword } = require('../controller/userController');

// register user
router.post('/register', userRegister)
router.post('/login', loginUser);
router.get('/:id', getUserDetails);
router.post('/forgot-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router;

