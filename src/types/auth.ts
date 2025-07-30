import { Request } from 'express';
import { IUser } from '../models/User';

// Module augmentation to extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}