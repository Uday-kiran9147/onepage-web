import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';

const router: Router = Router();

// GET /api/profile/check-username — Check username availability
router.get('/check-username', asyncHandler(ProfileController.checkUsername));

// GET /api/profile/:username — Public profile (no auth)
router.get('/:username', asyncHandler(ProfileController.getProfile));

// PUT /api/profile — Update profile (auth required)
router.put('/', authenticate, asyncHandler(ProfileController.updateProfile));

export default router;
