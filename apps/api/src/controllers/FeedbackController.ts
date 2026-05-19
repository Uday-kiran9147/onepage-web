import { Request, Response } from 'express';
import { FeedbackSubmitSchema } from '@mirror/shared';
import { FeedbackService } from '../services/FeedbackService';
import { AuthRequest } from '../types/AuthRequest';
import { AppError } from '../types/AppError';

export class FeedbackController {
  /**
   * POST /api/feedback/:username — Submit anonymous feedback (no auth).
   * Validates with shared Zod schema.
   */
  static async submit(req: Request, res: Response) {
    const { username } = req.params;
    const parsed = FeedbackSubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, parsed.error.errors.map((e) => e.message).join(', '));
    }

    const ipHash = res.locals.ipHash as string;
    const result = await FeedbackService.submit(username, parsed.data, ipHash);
    res.status(201).json({ status: 'ok', feedbackId: result.id });
  }

  /**
   * GET /api/feedback — Get your own feedback (auth required).
   */
  static async getMyFeedback(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const feedback = await FeedbackService.getMyFeedback(req.user.userId);
    res.json({ status: 'ok', feedback });
  }

  /**
   * POST /api/feedback/:id/hide — Hide a feedback (auth required).
   */
  static async hide(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const result = await FeedbackService.hide(req.params.id, req.user.userId);
    res.json({ status: 'ok', ...result });
  }

  /**
   * POST /api/feedback/:id/report — Report a feedback (auth required).
   */
  static async report(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const result = await FeedbackService.report(req.params.id, req.user.userId);
    res.json({ status: 'ok', ...result });
  }
}
