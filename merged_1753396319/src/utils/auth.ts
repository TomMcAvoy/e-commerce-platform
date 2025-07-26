import jwt from 'jsonwebtoken';
import { Response } from 'express';

export const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
};
