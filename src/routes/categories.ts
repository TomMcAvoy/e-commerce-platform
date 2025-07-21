import express from 'express';

const router = express.Router();

// Category routes will be implemented later
router.get('/', (req, res) => {
  res.json({ message: 'Category routes coming soon' });
});

export default router;
