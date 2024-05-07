const { Router } = require('express')
const { check } = require('express-validator')
const authController = require('./authController.js')
const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')

const authRouter = new Router()

// Registration Route
authRouter.post('/registration', 
    [check('email', 'Invalid email').isEmail(), 
    check('password', 'password should be more then 4 and less then 10 symbols').isLength({ min:4, max:10 })], 
    authController.registration)

// Login Route
authRouter.post('/login', authController.login)

// Get Users Route
authRouter.get('/users', roleMiddleware(['USER', 'ADMIN']), authController.getUsers)

// Verify Route
authRouter.get('/verify', authMiddleware, authController.verify)

module.exports = authRouter;