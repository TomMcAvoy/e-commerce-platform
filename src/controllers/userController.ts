import { Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { TenantRequest } from '../middleware/tenantResolver';

// @desc    Get all users for the tenant
// @route   GET /api/users
export const getUsers = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const users = await User.find({ tenantId: req.tenantId });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
export const getUser = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({ _id: req.params.id, tenantId: req.tenantId });
        if (!user) {
            return next(new AppError(`User not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
export const createUser = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.create({ ...req.body, tenantId: req.tenantId });
        res.status(201).json({ success: true, data: user });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
export const updateUser = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.id, tenantId: req.tenantId }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return next(new AppError(`User not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: user });
    } catch (error: any) {
        next(new AppError(error.message, 400));
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
export const deleteUser = async (req: TenantRequest, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id, tenantId: req.tenantId });
        if (!user) {
            return next(new AppError(`User not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        next(new AppError(error.message, 500));
    }
};
