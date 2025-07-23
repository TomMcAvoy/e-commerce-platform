import express from 'express';
import { register, login, getMe, getStatus } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Auth routes following copilot authentication patterns
router.post('/register', register);
router.post('/login', login);
router.get('/status', getStatus);
router.get('/me', protect, getMe);

// Export using CommonJS for Jest compatibility
module.exports = router;
export default router;
