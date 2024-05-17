import { Router } from 'express';
import { check, ValidationChain } from 'express-validator';
import authController from './authController';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const authRouter = Router()

// Registration Route
const registrationValidation: ValidationChain[] = [
    check('email', 'Invalid email').isEmail(), 
    check('password', 'Password should be more than 4 and less than 10 symbols').isLength({ min: 4, max: 10 })
];

authRouter.post('/registration', registrationValidation, authController.registration)

// Login Route
authRouter.post('/login', authController.login)

// Get Users Route
authRouter.get('/users', roleMiddleware(['ADMIN']), authController.getUsers)

// Verify Route
authRouter.get('/verify', authMiddleware, authController.verify)

export default authRouter;
