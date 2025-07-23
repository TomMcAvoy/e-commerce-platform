import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import AppError from '../utils/AppError';

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchQuery = req.query.q as string;

    if (!searchQuery || searchQuery.trim() === '') {
      return next(new AppError('Please provide a search query parameter "q".', 400));
    }

    const products = await Product.find(
      { $text: { $search: searchQuery } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .populate('vendorId', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
