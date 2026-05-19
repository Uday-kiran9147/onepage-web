import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/AppError';
import { env } from '../lib/env';

/**
 * Global Express error handler.
 * Never exposes stack traces in production.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  console.error('[ErrorHandler] Unhandled error:', err);

  res.status(500).json({
    status: 'error',
    message:
      env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
};
