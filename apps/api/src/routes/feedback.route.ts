import { Router } from 'express';
import { FeedbackController } from '../controllers/FeedbackController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';
import { feedbackRateLimit } from '../middleware/rateLimit';

const router = Router();

// POST /api/feedback/:username — Submit anonymous feedback (no auth, rate limited)
router.post('/:username', asyncHandler(feedbackRateLimit), asyncHandler(FeedbackController.submit));

// GET /api/feedback — Get your own feedback (auth required)
router.get('/', authenticate, asyncHandler(FeedbackController.getMyFeedback));

// POST /api/feedback/:id/hide — Hide a feedback (auth required)
router.post('/:id/hide', authenticate, asyncHandler(FeedbackController.hide));

// POST /api/feedback/:id/report — Report a feedback (auth required)
router.post('/:id/report', authenticate, asyncHandler(FeedbackController.report));

export default router;
