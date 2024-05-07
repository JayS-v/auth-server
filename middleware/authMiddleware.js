const jwt = require('jsonwebtoken')
const { secret } = require('../auth/authConfig.js')

//gives acces to some functions for allowed users only
module.exports = function (req, res, next) {
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

        const decodedToken = jwt.verify(token, secret)
        req.user = decodedToken

        next() 
    } catch (e) {
        console.log(e)
        return res.status(403).json({ message: 'no acces for this user' })
    }
}