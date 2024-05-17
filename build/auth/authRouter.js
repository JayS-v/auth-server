"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = __importDefault(require("./authController"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const authRouter = (0, express_1.Router)();
// Registration Route
const registrationValidation = [
    (0, express_validator_1.check)('email', 'Invalid email').isEmail(),
    (0, express_validator_1.check)('password', 'Password should be more than 4 and less than 10 symbols').isLength({ min: 4, max: 10 })
];
authRouter.post('/registration', registrationValidation, authController_1.default.registration);
// Login Route
authRouter.post('/login', authController_1.default.login);
// Get Users Route
authRouter.get('/users', (0, roleMiddleware_1.default)(['USER', 'ADMIN']), authController_1.default.getUsers);
// Verify Route
authRouter.get('/verify', authMiddleware_1.default, authController_1.default.verify);
exports.default = authRouter;
