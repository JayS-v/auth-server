import { Request, Response } from 'express';
import User, { IUser }  from './models/User';
import Role from './models/Role';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { secret } from './authConfig';

interface RequestWithUser extends Request {
    user?: IUser;
}

interface UserSignRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

const generateAccesToken = (id: string, roles: string[], email: string): string => { 
    const payload = { id, roles, email }
    return jwt.sign(payload, secret, { expiresIn: "24h" })
}

const handleError = (res: Response, statusCode: number, message: string, error: any): Response => {
    console.error(error);
    return res.status(statusCode).json({ message });
};

class AuthController {
    async registration(req: UserSignRequest, res: Response): Promise<Response> {
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
            const newUser = new User({ email, password: hashPassword, roles: [ newUserRole?.value ] })
            await newUser.save()

            return res.json({ message: 'Registration done' })
        } catch (error) {
            return handleError(res, 400, 'Registration error', error);
        }
    }

    async login(req: UserSignRequest, res: Response): Promise<Response> {
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
            return handleError(res, 400, 'Login error', error);
        }
    }

    async getUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await User.find()
            return res.json(users)
        } catch (error) {
            return handleError(res, 500, 'Error getting users', error);
        }
    }

    async verify(req: RequestWithUser, res: Response): Promise<Response> {
        try {
            const user = req.user;
            return res.status(200).json({ message: 'Authorized access', user})
        } catch (error) {
            return handleError(res, 400, 'Acces not authorized', error);
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

export default new AuthController();

