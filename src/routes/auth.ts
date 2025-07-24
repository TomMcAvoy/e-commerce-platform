import { Router } from 'express';
import { register, login, getAuthStatus } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/status', getAuthStatus);
router.get('/me', protect, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;
