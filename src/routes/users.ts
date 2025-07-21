import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// User routes will be implemented later
router.get('/profile', protect, (req, res) => {
  res.json({ message: 'User routes coming soon' });
});

export default router;
