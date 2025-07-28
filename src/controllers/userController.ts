import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import AppError from '../utils/AppError';

// @desc    Get all users for the tenant
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({ tenantId: req.tenantId });
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ _id: req.params.id, tenantId: req.tenantId });
    if (!user) {
        return next(new AppError(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Get current logged in user
// @route   GET /api/users/me
// @access  Private
export const getMe = asyncHandler(async (req: Request, res: Response) => {
    // req.user is populated by the 'protect' middleware
    res.status(200).json({ success: true, data: req.user });
});

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.create({ ...req.body, tenantId: req.tenantId });
    res.status(201).json({ success: true, data: user });
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, req.body, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        return next(new AppError(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: user });
});

// @desc    Update user details for the currently logged-in user.
// @route   PUT /api/users/me
// @access  Private
export const updateMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, addresses, preferences } = req.body;

    const fieldsToUpdate: any = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (addresses) fieldsToUpdate.addresses = addresses;
    if (preferences) fieldsToUpdate.preferences = preferences;

    const user = await User.findByIdAndUpdate(req.user!.id, { $set: fieldsToUpdate }, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
    if (!user) {
        return next(new AppError(`User not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: {} });
});
