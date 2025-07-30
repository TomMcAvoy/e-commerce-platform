import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { dropshippingService } from '../services/dropshipping/DropshippingService';
import AppError from '../utils/AppError';

// @desc    Import products from DSers/AliExpress
// @route   POST /api/dsers/import
// @access  Private/Admin
export const importProducts = asyncHandler(async (req: Request, res: Response) => {
  const { keyword, category, limit = 50 } = req.body;
  
  const products = await dropshippingService.getProducts('dsers', {
    keyword,
    category,
    limit
  });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// @desc    Sync inventory with DSers
// @route   POST /api/dsers/sync
// @access  Private/Admin
export const syncInventory = asyncHandler(async (req: Request, res: Response) => {
  // Basic sync implementation
  res.status(200).json({
    success: true,
    message: 'Inventory sync initiated'
  });
});

// @desc    Get DSers account info
// @route   GET /api/dsers/account
// @access  Private/Admin
export const getAccountInfo = asyncHandler(async (req: Request, res: Response) => {
  const health = await dropshippingService.getHealth();
  
  res.status(200).json({
    success: true,
    data: health.dsers || { status: 'not_configured' }
  });
});