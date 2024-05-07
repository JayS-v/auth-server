const User = require('./models/User.js')
const Role = require('./models/Role.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./authConfig.js')

generateAccesToken = (id, roles, email) => { 
    const payload = { id, roles, email }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

const handleError = (res, statusCode, message, error) => {
    console.error(error);
    res.status(statusCode).json({ message });
};

class authController {
    async registration(req, res){
        try  {
            const errors = validationResult(req) 
            if(!errors.isEmpty()) { 
                return res.status(400).json({ message: 'Bad request, registration error',  errors})
            }

            const { email, password } = req.body;
            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'this email already exists' })
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUserRole = await Role.findOne({ value: "USER" })
            const newUser = new User({ email, password: hashPassword, roles: [ newUserRole.value ] })
            await newUser.save()

            return res.json({ message: 'Registration done' })
        } catch (error) {
            handleError(res, 400, 'Registration error', error);
        }
    }

    async login(req, res){
        try  {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if(!user) {
                return res.status(400).json({ message: `user with ${email} not found` })
            }

            const validPassword = bcrypt.compareSync(password, user.password)

            if(!validPassword) {
                return res.status(400).json({ message: `password not correct` })
            }

            const token = generateAccesToken(user._id, user.roles, user.email)
            return res.json({ token }) 
        } catch (error) {
            handleError(res, 400, 'Login error', error);
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()
            res.json(users)
        } catch (error) {
            handleError(res, 500, 'Error getting users', error);
        }
    }

    async verify(req, res) {
        try {
            const user = req.user;
            res.status(200).json({ message: 'Authorized access', user})
        } catch (error) {
            handleError(res, 400, 'Acces not authorized', error);
        }
    }
}


//------------ add permanent roles to DB :
// USER (by default):
// const userRole = new Role() 
// await userRole.save()

// MODERATOR:
// const moderatorRole = new Role({value: 'MODERATOR'})
// await moderatorRole.save()
//--------------------------------

module.exports = new authController();
