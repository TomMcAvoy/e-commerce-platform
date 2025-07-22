import express from 'express';
import { register, login, logout, getMe, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect as any, getMe as any);
router.put('/profile', protect as any, updateProfile as any);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:token', validateResetPassword, resetPassword);

export default router;
