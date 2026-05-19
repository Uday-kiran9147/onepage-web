import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// POST /api/auth/google — OAuth callback, set httpOnly JWT cookie
router.post('/google', asyncHandler(AuthController.googleLogin));

// POST /api/auth/logout — Clear cookie
router.post('/logout', asyncHandler(AuthController.logout));

// GET /api/auth/me — Return current user
router.get('/me', authenticate, asyncHandler(AuthController.me));

export default router;
