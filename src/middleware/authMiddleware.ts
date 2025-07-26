import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import User from '../models/User';
import AppError from '../utils/AppError';
import { TenantRequest } from './tenantResolver';

// Extend the request type to include the user property after authentication
interface AuthRequest extends TenantRequest {
    user?: any;
}

/**
 * Protects routes by verifying JWT token from cookie or Authorization header.
 * Attaches the authenticated user to the request object.
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next(new AppError('Not authorized, no token', 401));
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return next(new AppError('No user found with this ID', 404));
        }

        next();
    } catch (err) {
        return next(new AppError('Not authorized, token failed', 401));
    }
};

/**
 * Authorizes users based on their role.
 * @param {...string} roles - List of roles allowed to access the route.
 */
export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403));
        }
        next();
    };
};