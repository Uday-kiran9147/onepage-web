import { Router } from 'express';
import { PatternController } from '../controllers/PatternController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// GET /api/patterns — Get AI-clustered patterns (auth required)
router.get('/', authenticate, asyncHandler(PatternController.getPatterns));

export default router;
