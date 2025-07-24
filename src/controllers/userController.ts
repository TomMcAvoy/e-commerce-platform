import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

/**
 * Get all users (admin only)
 * Following API Endpoints Structure from Copilot instructions
 */
export const getUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check if user is admin following Security Considerations
    if (!req.user || req.user.role !== 'admin') {
      throw new AppError('Not authorized for this route', 403);
    }

    // Mock users data - in production would query database
    const mockUsers = [
      {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'buyer',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'seller',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];

    // Following Database Patterns with pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedUsers = mockUsers.slice(startIndex, startIndex + limit);

    res.status(200).json({
      success: true,
      data: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockUsers.length / limit),
        totalItems: mockUsers.length,
        itemsPerPage: limit
      },
      message: 'Users fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single user by ID
 * Following Authentication Flow from Copilot instructions
 */
export const getUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    // Users can only access their own data, unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      throw new AppError('Not authorized to access this user data', 403);
    }

    // Mock user lookup - in production would query database
    const mockUser = {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'buyer',
      isActive: true,
      createdAt: new Date().toISOString(),
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'ST',
          zipCode: '12345',
          country: 'US'
        }
      }
    };

    res.status(200).json({
      success: true,
      data: mockUser,
      message: 'User fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user profile
 * Following Security Considerations from Copilot instructions
 */
export const updateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    // Users can only update their own data, unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      throw new AppError('Not authorized to update this user', 403);
    }

    // Don't allow password updates through this endpoint
    const { password, role, ...updateData } = req.body;

    // Don't allow role changes unless admin
    if (role && req.user.role !== 'admin') {
      throw new AppError('Not authorized to change user role', 403);
    }

    // Mock user update - in production would update database
    const updatedUser = {
      id: userId,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (admin only)
 * Following Security Considerations from Copilot instructions
 */
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.params.id;

    // Only admins can delete users
    if (req.user.role !== 'admin') {
      throw new AppError('Not authorized for this route', 403);
    }

    // Don't allow admin to delete themselves
    if (req.user.id === userId) {
      throw new AppError('Cannot delete your own account', 400);
    }

    // Mock user deletion - in production would soft delete in database
    res.status(200).json({
      success: true,
      data: null,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * Following Authentication Flow from Copilot instructions
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Mock current user data - in production would come from database
    const currentUser = {
      id: req.user.id,
      name: req.user.name || 'Current User',
      email: req.user.email || 'user@example.com',
      role: req.user.role || 'buyer',
      isActive: true,
      profile: {
        avatar: null,
        preferences: {
          notifications: true,
          newsletter: false,
          theme: 'light'
        }
      },
      stats: {
        ordersCount: 0,
        totalSpent: 0,
        memberSince: new Date().toISOString()
      }
    };

    res.status(200).json({
      success: true,
      data: currentUser,
      message: 'Current user fetched successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * Following Authentication Flow from Copilot instructions
 */
export const updatePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('New password must be at least 6 characters', 400);
    }

    // Mock password validation and update - in production would:
    // 1. Verify current password with bcrypt
    // 2. Hash new password
    // 3. Update in database
    
    res.status(200).json({
      success: true,
      data: null,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};
