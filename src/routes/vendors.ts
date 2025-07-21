import express from 'express';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Vendor routes will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Vendor routes coming soon' });
});

router.post('/', protect, authorize('vendor', 'admin'), (req, res) => {
  res.json({ message: 'Create vendor coming soon' });
});

export default router;
