import { IUser } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tenantId?: any;
    }
  }
}
