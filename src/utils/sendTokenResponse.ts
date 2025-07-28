import { Response } from 'express';
import { IUser } from '../models/User';

/**
 * Get token from model, create cookie and send response
 * Following Authentication Flow pattern from Copilot Instructions
 */
export const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token following JWT pattern
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE || '30') * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
};

// Also export as default for backwards compatibility
export default sendTokenResponse;