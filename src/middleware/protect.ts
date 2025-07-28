import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../utils/AppError';
import User, { IUser } from '../models/User';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Middleware to protect routes by verifying JWT token.
 * Follows Authentication Flow from Copilot Instructions.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) { // Alternative: check for token in cookies
  //   token = req.cookies.token;
  // }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('No user found with this id', 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized, token failed', 401));
  }
};

/**
 * Middleware to grant access to specific roles.
 * This function was not being exported correctly, causing the TypeError.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(`User role '${req.user?.role}' is not authorized to access this route`, 403)
      );
    }
    next();
  };
};