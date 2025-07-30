import { Request, Response, NextFunction } from 'express';

// Async handler to wrap async functions following copilot error handling pattern
export const asyncHandler = <T extends Request = Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => (req: T, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
