import { Types } from 'mongoose';
import { IUser } from '../../models/User';

// This declaration file allows us to add custom properties to the Express Request object.
declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      tenantId?: Types.ObjectId;
    }
  }
}