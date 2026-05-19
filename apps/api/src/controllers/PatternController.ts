import { Response } from 'express';
import { PatternService } from '../services/PatternService';
import { AuthRequest } from '../types/AuthRequest';
import { AppError } from '../types/AppError';

export class PatternController {
  /**
   * GET /api/patterns — Get AI-clustered patterns (auth required).
   */
  static async getPatterns(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const patterns = await PatternService.getPatterns(req.user.userId);
    res.json({ status: 'ok', patterns });
  }
}
