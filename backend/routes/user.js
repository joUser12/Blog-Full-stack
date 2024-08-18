const express = require('express');
const router = express.Router();
const { loginUser, userRegister, getUserDetails } = require('../controller/userController');

// register user
router.post('/register', userRegister)
router.post('/login', loginUser);
router.get('/:id', getUserDetails);

module.exports = router;

