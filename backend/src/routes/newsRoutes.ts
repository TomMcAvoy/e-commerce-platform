import express from 'express';
import {
  getNewsFeed,
  getArticleBySlug,
  fetchNews,
  toggleLike,
  addComment
} from '../controllers/newsController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getNewsFeed);
router.get('/:slug', getArticleBySlug);

// Protected routes (require authentication)
router.use(protect);
router.post('/:id/like', toggleLike);
router.post('/:id/comments', addComment);

// Admin route for manual news fetch
router.post('/fetch', fetchNews);

export default router;