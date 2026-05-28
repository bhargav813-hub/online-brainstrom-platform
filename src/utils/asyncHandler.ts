import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps async route handlers to eliminate repetitive try-catch blocks.
 * Any thrown error is automatically forwarded to the global error handler.
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
