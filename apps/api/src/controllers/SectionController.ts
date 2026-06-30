import { Response } from 'express';
import { SectionService } from '../services/SectionService';
import { AuthRequest } from '../types/AuthRequest';
import { AppError } from '../types/AppError';

export class SectionController {
  /**
   * GET /api/profile/sections — Get sections for authenticated user.
   */
  static async getSections(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const sections = await SectionService.getSections(req.user.userId);
    res.json({ status: 'ok', sections });
  }

  /**
   * POST /api/profile/sections — Add a section.
   */
  static async addSection(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const { type, title, data } = req.body;
    if (!type || !title) throw new AppError(400, 'Type and title are required');
    const section = await SectionService.addSection(req.user.userId, type, title, data);
    res.json({ status: 'ok', section });
  }

  /**
   * PUT /api/profile/sections/reorder — Reorder sections.
   */
  static async reorderSections(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) throw new AppError(400, 'orderedIds array is required');
    await SectionService.reorderSections(req.user.userId, orderedIds);
    res.json({ status: 'ok' });
  }

  /**
   * PUT /api/profile/sections/:id — Update a section.
   */
  static async updateSection(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const { id } = req.params;
    const { title, data } = req.body;
    const section = await SectionService.updateSection(req.user.userId, id, title, data);
    res.json({ status: 'ok', section });
  }

  /**
   * DELETE /api/profile/sections/:id — Delete a section.
   */
  static async deleteSection(req: AuthRequest, res: Response) {
    if (!req.user) throw new AppError(401, 'Not authenticated');
    const { id } = req.params;
    await SectionService.deleteSection(req.user.userId, id);
    res.json({ status: 'ok' });
  }
}
