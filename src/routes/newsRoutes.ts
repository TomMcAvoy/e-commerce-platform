import express from 'express';
// FIX: Import the single default export from the controller.
import newsController from '../controllers/newsController';

const router = express.Router();

// FIX: Use the properties of the imported controller object as handlers.
// This ensures the functions are correctly resolved and not undefined.
router.route('/')
  .get(newsController.getNewsArticles);

// Add the new route for the external news feed
router.route('/feed')
  .get(newsController.getNewsFeed);

// Add route for available countries
router.route('/countries')
  .get(newsController.getNewsCountries);

// Add route for available categories
router.route('/categories')
  .get(newsController.getNewsCategories);

// FIX: The route for slugs should be distinct to avoid conflicts.
router.route('/slug/:slug')
  .get(newsController.getNewsArticleBySlug);

export default router;