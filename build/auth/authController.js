"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("./models/User"));
const Role_1 = __importDefault(require("./models/Role"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const authConfig_1 = require("./authConfig");
const generateAccesToken = (id, roles, email) => {
    const payload = { id, roles, email };
    return jsonwebtoken_1.default.sign(payload, authConfig_1.secret, { expiresIn: "24h" });
};
const handleError = (res, statusCode, message, error) => {
    console.error(error);
    return res.status(statusCode).json({ message });
};
class AuthController {
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: 'Bad request, registration error', errors });
                }
                const { email, password } = req.body;
                const candidate = yield User_1.default.findOne({ email });
                if (candidate) {
                    return res.status(400).json({ message: 'this email already exists' });
                }
                const hashPassword = bcryptjs_1.default.hashSync(password, 7);
                const newUserRole = yield Role_1.default.findOne({ value: "USER" });
                const newUser = new User_1.default({ email, password: hashPassword, roles: [newUserRole === null || newUserRole === void 0 ? void 0 : newUserRole.value] });
                yield newUser.save();
                return res.json({ message: 'Registration done' });
            }
            catch (error) {
                return handleError(res, 400, 'Registration error', error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield User_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: `user with ${email} not found` });
                }
                const validPassword = bcryptjs_1.default.compareSync(password, user.password);
                if (!validPassword) {
                    return res.status(400).json({ message: `password not correct` });
                }
                const token = generateAccesToken(user._id, user.roles, user.email);
                return res.json({ token });
            }
            catch (error) {
                return handleError(res, 400, 'Login error', error);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.default.find();
                return res.json(users);
            }
            catch (error) {
                return handleError(res, 500, 'Error getting users', error);
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                return res.status(200).json({ message: 'Authorized access', user });
            }
            catch (error) {
                return handleError(res, 400, 'Acces not authorized', error);
            }
        });
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
exports.default = new AuthController();
