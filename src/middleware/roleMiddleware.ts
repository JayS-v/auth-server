import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../auth/authConfig';
import { IUser } from '../auth/models/User'

type Role = 'USER' | 'MODERATOR' | 'ADMIN';

export default function checkRole(roles: Role[]) {
    return function (req: Request, res: Response, next: NextFunction): void | Response  {
        if (req.method === 'OPTIONS') {
            return next()
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
            
            const { roles: userRoles } = jwt.verify(token, secret) as IUser
            let hasRole = false

            userRoles.forEach(role => {
                if (roles.includes(role as Role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res.status(403).json({message: "No acces for this user"})
            }
    
            return next() 
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: 'no acces for this user' })
        }
    }
}