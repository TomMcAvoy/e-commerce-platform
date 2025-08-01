import * as express from 'express';
const newsController = require('../controllers/newsControllerSimple');

const router = express.Router();

router.route('/')
  .get(newsController.default.getNewsArticles);

router.route('/countries')
  .get(newsController.default.getNewsCountries);

router.route('/categories')
  .get(newsController.default.getNewsCategories);

export default router;