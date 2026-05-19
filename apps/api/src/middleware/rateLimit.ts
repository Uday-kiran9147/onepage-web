import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { redis } from '../lib/redis';
import { env } from '../lib/env';
import { AppError } from '../types/AppError';

/**
 * Hash IP with SHA-256 + salt — NEVER store raw IPs.
 */
export const hashIp = (ip: string): string => {
  return crypto
    .createHash('sha256')
    .update(ip + env.JWT_SECRET) // using JWT_SECRET as salt
    .digest('hex');
};

/**
 * Redis-based IP rate limiter.
 * Max 3 feedback submissions per IP per profile per 24h.
 * Uses the exact pattern from CLAUDE.md.
 */
export const feedbackRateLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rawIp = req.ip || req.socket.remoteAddress || 'unknown';
  const ipHash = hashIp(rawIp);
  const profileUsername = req.params.username;

  const key = `rl:feedback:${ipHash}:${profileUsername}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 86400); // 24h TTL
  if (count > 3) {
    throw new AppError(429, 'You have already given feedback to this person today');
  }

  // Pass ipHash to downstream handlers via res.locals
  res.locals.ipHash = ipHash;
  next();
};
