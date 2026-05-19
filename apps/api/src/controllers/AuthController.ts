import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AppError } from '../types/AppError';
import { AuthRequest } from '../types/AuthRequest';
import { env } from '../lib/env';

export class AuthController {
  /**
   * POST /api/auth/google — OAuth callback, set httpOnly JWT cookie.
   */
  static async googleLogin(req: Request, res: Response) {
    const { idToken } = req.body;
    if (!idToken) throw new AppError(400, 'idToken is required');

    const { user, token } = await AuthService.googleLogin(idToken);

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ status: 'ok', user });
  }

  /**
   * POST /api/auth/logout — Clear cookie.
   */
  static async logout(_req: Request, res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.json({ status: 'ok' });
  }

  /**
   * GET /api/auth/me — Return current user.
   */
  static async me(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const user = await AuthService.getMe(req.user.userId);
    res.json({ status: 'ok', user });
  }
}
