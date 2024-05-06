const { Router } = require('express')
const authController = require('./authController.js')
const { check } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware.js')
const roleMiddleware = require('../middleware/roleMiddleware.js')


const authRouter = new Router()

authRouter.post(
    '/registration', 
    [                                                                                                                   //validator middleware as 2nd argument
        // check('username', 'username can not be empty').notEmpty(), 
        check('email', 'Invalid email').isEmail(), 
        check('password', 'password should be more then 4 and less then 10 symbols').isLength({ min:4, max:10 }) 
    ], 
    authController.registration)
    
authRouter.post('/login', authController.login)

// function signature indicates to Express that it is designed to be used as a middleware, where req, res, and next are automatically passed by Express to middleware functions. 
authRouter.get('/users', roleMiddleware(['USER', 'ADMIN']), authController.getUsers)

authRouter.get('/verify', authMiddleware, (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ message: 'Authorized access', user})
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'Login error' })
    }
})


// TEST --------------------------------------------------------------------------
const lol = (req, res) => {
    console.log(req)
    // res.cookie('lol', 'lol');
    // res.setHeader('Set-Cookie', 'myCookie=example; Max-Age=3600; Path=/');
    res.setHeader(
        "Set-Cookie",
        `vasya=pupkin; HttpOnly; Secure; Max-Age=${60 * 60}; SameSite=Strict; Path=/; Domain=localhost`,
    )

    res.json({succes: 'ok'})

}

authRouter.get('/test', lol)

// TEST --------------------------------------------------------------------------




module.exports = authRouter;