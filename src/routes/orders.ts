import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Order routes will be implemented later
router.get('/', protect, (req, res) => {
  res.json({ message: 'Order routes coming soon' });
});

export default router;
