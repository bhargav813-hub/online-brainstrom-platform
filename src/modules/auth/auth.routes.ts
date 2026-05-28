import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rateLimiter.middleware';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validators';

const router = Router();

/**
 * Auth Routes
 * POST /api/auth/register       — Register new user
 * POST /api/auth/login          — Login
 * POST /api/auth/refresh-token  — Refresh access token
 * POST /api/auth/logout         — Logout (requires auth)
 */

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);

export default router;
