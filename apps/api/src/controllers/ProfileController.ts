import { Request, Response } from 'express';
import { ProfileService } from '../services/ProfileService';
import { AuthRequest } from '../types/AuthRequest';
import { AppError } from '../types/AppError';

export class ProfileController {
  /**
   * GET /api/profile/:username — Public profile (no auth).
   */
  static async getProfile(req: Request, res: Response) {
    const { username } = req.params;
    const profile = await ProfileService.getByUsername(username);
    res.json({ status: 'ok', profile });
  }

  /**
   * GET /api/profile/check-username?username=...
   */
  static async checkUsername(req: Request, res: Response) {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
      throw new AppError(400, 'Username is required');
    }
    const isAvailable = await ProfileService.checkUsername(username);
    res.json({ status: 'ok', available: isAvailable });
  }

  /**
   * PUT /api/profile — Update bio, username, name (auth required).
   */
  static async updateProfile(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const { bio, name, username } = req.body;
    const user = await ProfileService.updateProfile(req.user.userId, { bio, name, username });
    res.json({ status: 'ok', user });
  }
}
