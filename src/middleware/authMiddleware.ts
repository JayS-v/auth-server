import jwt from 'jsonwebtoken';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import { secret } from '../auth/authConfig';
import { IUser } from '../auth/models/User'

interface CustomRequest extends ExpressRequest {
    user?: IUser;
}

//gives acces for allowed users only
const authMiddleware =  (req: CustomRequest, res: Response, next: NextFunction): void | Response => {
    if (req.method === 'OPTIONS') {
        next()
    }

    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        const tokenParts = authorizationHeader.split(' ');

        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const token = tokenParts[1];

        if (!token) {
            return res.status(403).json({ message: 'no acces for this user' }) 
        }

        const decodedToken = jwt.verify(token, secret) as IUser;
        req.user = decodedToken

        next() 
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: 'no acces for this user' })
    }
}

export default authMiddleware;