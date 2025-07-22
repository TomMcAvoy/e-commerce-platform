import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// User routes will be implemented later
router.get('/profile', protect as any, (req: any, res: any) => {
  res.json({ message: 'User routes coming soon' });
});

export default router;
