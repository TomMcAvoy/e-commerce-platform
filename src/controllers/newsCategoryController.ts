import { Request, Response, NextFunction } from 'express';
import NewsCategory from '../models/NewsCategory';

const getNewsCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await NewsCategory.find({ tenantId: req.tenantId }).sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// Use the robust namespace export pattern
export default {
  getNewsCategories
};