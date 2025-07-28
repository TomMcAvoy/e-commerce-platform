import express from 'express';
import newsCategoryController from '../controllers/newsCategoryController';

const router = express.Router();

router.route('/')
  .get(newsCategoryController.getNewsCategories);

export default router;