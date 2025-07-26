import { Request, Response } from 'express';
import { DropshippingService } from '../services/dropshipping/DropshippingService';
import { AppError } from '../middleware/errorHandler';

const dropshippingService = DropshippingService.getInstance();

interface AuthRequest extends Request {
  user?: any;
}

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderData = req.body;
    const result = await dropshippingService.createOrder(orderData);
    res.status(201).json(result);
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};