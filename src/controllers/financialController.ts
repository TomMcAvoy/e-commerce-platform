import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthenticatedRequest } from '../middleware/auth';
import { Transaction, PayoutRequest } from '../models/FinancialModels';
import { ApiResponse, PaginatedResponse } from '../types/ApiResponse';
import { FinancialSummary } from '../types/Financials';
import AppError from '../utils/AppError';
import User from '../models/User';

// @desc    Get financial dashboard summary
// @route   GET /api/financials/dashboard
// @access  Private/Admin or Vendor
export const getFinancialDashboard = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<FinancialSummary>>,
  next: NextFunction
) => {
  // This is a placeholder implementation. A real implementation would involve
  // complex aggregation queries based on the user's role (admin vs. vendor).
  const summary: FinancialSummary = {
    totalRevenue: 50000,
    totalPayouts: 15000,
    pendingPayouts: 2500,
    netProfit: 35000,
    transactionVolume: 250,
  };

  res.status(200).json({ success: true, data: summary });
});

// @desc    Get transaction history for a user or all users
// @route   GET /api/financials/transactions
// @access  Private/Admin or Vendor
export const getTransactionHistory = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<PaginatedResponse<InstanceType<typeof Transaction>>>,
  next: NextFunction
) => {
  const query = req.user.role === 'admin' ? {} : { user: req.user._id };
  const transactions = await Transaction.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

// @desc    Request a payout
// @route   POST /api/financials/payouts
// @access  Private/Vendor
export const requestPayout = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<ApiResponse<InstanceType<typeof PayoutRequest>>>,
  next: NextFunction
) => {
  const { amount, method } = req.body;
  const vendorId = req.user._id;

  if (req.user.role !== 'vendor') {
    return next(new AppError('Only vendors can request payouts', 403));
  }

  // In a real app, you'd check if the vendor's balance is sufficient.
  const newPayoutRequest = await PayoutRequest.create({
    vendor: vendorId,
    amount,
    method,
    status: 'pending',
  });

  res.status(201).json({ success: true, data: newPayoutRequest });
});

// @desc    Get all payout requests (for admins)
// @route   GET /api/financials/payouts
// @access  Private/Admin
export const getPayoutRequests = asyncHandler(async (
  req: AuthenticatedRequest,
  res: Response<PaginatedResponse<InstanceType<typeof PayoutRequest>>>,
  next: NextFunction
) => {
  const payoutRequests = await PayoutRequest.find().populate('vendor', 'firstName lastName email');
  
  res.status(200).json({
    success: true,
    count: payoutRequests.length,
    data: payoutRequests,
  });
});
