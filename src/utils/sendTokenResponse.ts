import { Response } from 'express';
import { IUser } from '../models/User';

/**
 * Signs a JWT, sets it in an HTTP-only cookie, and sends a JSON response.
 * This is a standardized way to handle successful login/registration.
 * @param user The user document from Mongoose.
 * @param statusCode The HTTP status code for the response.
 * @param res The Express response object.
 */
export const sendTokenResponse = (user: IUser, statusCode: number, res: Response) => {
  // Create token
  // @ts-ignore - Assume getSignedJwtToken method exists on the user model
  const token = user.getSignedJwtToken();

  const options: any = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE ? parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      // It's good practice to send back some user data, but exclude sensitive info
      data: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
};