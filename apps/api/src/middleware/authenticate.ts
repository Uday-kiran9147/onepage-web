import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';
import { AppError } from '../types/AppError';
import { AuthRequest } from '../types/AuthRequest';

/**
 * Reads httpOnly JWT cookie, verifies, attaches req.user.
 * JWT payload: { userId, username }
 */
export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new AppError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: string;
      username: string;
    };
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token');
  }
};
