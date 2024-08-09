const express = require('express');
const router = express.Router();
const { loginUser, userRegister } = require('../controller/userController');

// register user
router.post('/register', userRegister)
router.post('/login', loginUser);

module.exports = router;

