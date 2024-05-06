const User = require('./models/User.js')
const Role = require('./models/Role.js')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const { secret } = require('./config.js')

generateAccesToken = (id, roles, email) => { //id and roles to hide this infor (payload) inside a token
    const payload = { id, roles, email } //here we can hide all necessary data
    return jwt.sign(payload, secret, { expiresIn: "24h" }) //1 arg payload, 2nd argument private key, 3d arg option object
}

class authController {
    async registration(req, res){
        try  {
            // const allHotelPrices = await HotelPriceService.getAll();
            const errors = validationResult(req) //will check request fields

            if(!errors.isEmpty()) { //check if errors array is not empty
                return res.status(400).json({ message: 'Bad request, registration error',  errors})
            }

            const { email, password } = req.body;
            const candidate = await User.findOne({ email: email })

            if (candidate) {
                return res.status(400).json({ message: 'this email already exists' })
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const newUserRole = await Role.findOne({ value: "USER" })
            const newUser = new User({ email: email, password: hashPassword, roles: [ newUserRole.value ] })
            await newUser.save()

            return res.json({ message: 'Registration done' })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async login(req, res){
        try  {
            // const hotelPrice = await HotelPriceService.getOne(req.params.id);
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

            return res.json({ token }) //return the token to client
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Login error' })
        }
    }

    async getUsers(req, res) {
        try {

            // add permanent roles to DB :

            // USER (by default):
            // const userRole = new Role() 
            // await userRole.save()

            // MODERATOR:
            // const moderatorRole = new Role({value: 'MODERATOR'})
            // await moderatorRole.save()

            const users = await User.find()
            res.json(users)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = new authController();
