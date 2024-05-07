const { secret } = require("../auth/authConfig");
const jwt = require('jsonwebtoken');

module.exports = function (roles) {
    return function (req, res, next) {
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
            
            const { roles: userRoles } = jwt.verify(token, secret)
            let hasRole = false

            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res.status(403).json({message: "No acces for this user"})
            }
    
            next() 
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: 'no acces for this user' })
        }
    }
}