import express from 'express';
import { optionalAuth } from '../middleware/auth';

const router = express.Router();

// Cart routes will be implemented later
router.get('/', optionalAuth, (req, res) => {
  res.json({ message: 'Cart routes coming soon' });
});

export default router;
