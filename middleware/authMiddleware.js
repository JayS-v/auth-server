const jwt = require('jsonwebtoken')
const { secret } = require('../auth/config.js')

//gives acces to some functions for allowed users only
module.exports = function (req, res, next) {
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

        //decodes the token
        const decodedToken = jwt.verify(token, secret)

        //create a new field 'user' in req and add decoded data in
        req.user = decodedToken

        next() //call the next middleware
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: 'no acces for this user' })
    }
}