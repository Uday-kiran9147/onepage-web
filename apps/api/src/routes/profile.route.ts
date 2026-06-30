import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { SectionController } from '../controllers/SectionController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';

const router: Router = Router();

// ─── Username Availability ───────────────────────────────────────
router.get('/check-username', asyncHandler(ProfileController.checkUsername));

// ─── Sections Management (Auth Required) ─────────────────────────
router.get('/sections', authenticate, asyncHandler(SectionController.getSections));
router.post('/sections', authenticate, asyncHandler(SectionController.addSection));
router.put('/sections/reorder', authenticate, asyncHandler(SectionController.reorderSections));
router.put('/sections/:id', authenticate, asyncHandler(SectionController.updateSection));
router.delete('/sections/:id', authenticate, asyncHandler(SectionController.deleteSection));

// ─── Profile details ─────────────────────────────────────────────
router.get('/:username', asyncHandler(ProfileController.getProfile));
router.put('/', authenticate, asyncHandler(ProfileController.updateProfile));

export default router;
