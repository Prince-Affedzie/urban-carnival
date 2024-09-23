const express = require('express');
const authController = require('../Controllers/authController');
const authRouter = express.Router();
authRouter.post('/login', authController.loginUser);
authRouter.post('/register', authController.registerUser);
authRouter.post('/logout', authController.logoutUser);
module.exports = authRouter;