"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authConfig_1 = require("../auth/authConfig");
function checkRole(roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            return next();
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
                return res.status(403).json({ message: 'no acces for this user' });
            }
            const { roles: userRoles } = jsonwebtoken_1.default.verify(token, authConfig_1.secret);
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return res.status(403).json({ message: "No acces for this user" });
            }
            return next();
        }
        catch (e) {
            console.log(e);
            return res.status(403).json({ message: 'no acces for this user' });
        }
    };
}
exports.default = checkRole;
