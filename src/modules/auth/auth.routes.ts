import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { authLimiter } from '../../middleware/rateLimiter.middleware';
import { registerSchema, loginSchema, refreshTokenSchema, verifyOtpSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validators';

const router = Router();

/**
 * Auth Routes
 * POST /api/auth/register       — Register new user (sends verification OTP)
 * POST /api/auth/verify-otp     — Verify email using registration OTP
 * POST /api/auth/login          — Login
 * POST /api/auth/forgot-password — Request password reset OTP
 * POST /api/auth/reset-password  — Reset password using OTP
 * POST /api/auth/refresh-token  — Refresh access token
 * POST /api/auth/logout         — Logout (requires auth)
 */

router.post('/register', authLimiter, validate(registerSchema), AuthController.register);
router.post('/verify-otp', authLimiter, validate(verifyOtpSchema), AuthController.verifyOtp);
router.post('/login', authLimiter, validate(loginSchema), AuthController.login);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), AuthController.resetPassword);
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/logout', authenticate, AuthController.logout);

export default router;
