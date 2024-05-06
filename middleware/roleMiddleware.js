const { secret } = require("../auth/config");
const jwt = require('jsonwebtoken');

//need to invoke it immeadiatly to return a middleware function
module.exports = function (roles) {

    //returns a middleware
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
    
        try {
            //takes token from header (bearer tokenKey)
            // const token = req.headers.authorization.split(' ')[1]
    
            const authorizationHeader = req.headers.authorization;
    
            if (!authorizationHeader) {
                // Authorization header is missing
                return res.status(401).json({ error: 'Authorization header is missing' });
            }
    
            const tokenParts = authorizationHeader.split(' ');
    
            if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
                // Invalid token format
                return res.status(401).json({ error: 'Invalid token format' });
            }
    
            const token = tokenParts[1];
    
            if (!token) {
                return res.status(403).json({ message: 'no acces for this user' }) 
            }
            
            //assign decoded roles value to userRoles variable
            const {roles: userRoles} = jwt.verify(token, secret)
            let hasRole = false

            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true
                }
            })

            if(!hasRole) {
                return res.status(403).json({message: "No acces for this user"})
            }
    
            next() //call the next middleware
        } catch (e) {
            console.log(e)
            return res.status(403).json({ message: 'no acces for this user' })
        }
    }
}