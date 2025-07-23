import { Request, Response, NextFunction } from 'express';

// Async handler to wrap async functions following copilot error handling pattern
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
