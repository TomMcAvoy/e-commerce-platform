import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const getCategoryAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Admin access required for category analytics', 403);
    }

    const categoryAnalytics = {
      overview: { totalCategories: 12, activeCategories: 10 },
      performance: [
        { categoryId: 'electronics', name: 'Electronics', totalSales: 125430.50, conversionRate: 4.2 },
        { categoryId: 'clothing', name: 'Clothing', totalSales: 89650.75, conversionRate: 5.1 }
      ]
    };

    res.status(200).json({
      success: true,
      data: categoryAnalytics,
      message: 'Category analytics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getConversionRates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Admin access required for conversion analytics', 403);
    }

    const conversionAnalytics = {
      overview: { averageConversionRate: 4.2, totalSessions: 125430 },
      categoryConversions: [
        { categoryId: 'beauty', name: 'Beauty', conversionRate: 6.2, trend: 'up' },
        { categoryId: 'electronics', name: 'Electronics', conversionRate: 4.2, trend: 'stable' }
      ]
    };

    res.status(200).json({
      success: true,
      data: conversionAnalytics,
      message: 'Conversion rate analytics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
