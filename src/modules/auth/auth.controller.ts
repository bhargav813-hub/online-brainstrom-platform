import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../types';

/**
 * Auth Controller — thin layer that delegates to AuthService.
 */
export class AuthController {
  /** POST /api/auth/register */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    ApiResponse.created(res, result, 'Verification OTP sent to your email');
  });

  /** POST /api/auth/login */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    ApiResponse.success(res, result, 'Login successful');
  });

  /** POST /api/auth/verify-otp */
  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.verifyOtp(req.body);
    ApiResponse.success(res, result, 'Email verification successful');
  });

  /** POST /api/auth/forgot-password */
  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.forgotPassword(req.body.email);
    ApiResponse.success(res, result, 'Password reset OTP sent to your email');
  });

  /** POST /api/auth/reset-password */
  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(req.body);
    ApiResponse.success(res, result, 'Password reset successful');
  });

  /** POST /api/auth/refresh-token */
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    ApiResponse.success(res, tokens, 'Token refreshed');
  });

  /** POST /api/auth/logout */
  static logout = asyncHandler(async (req: AuthRequest, res: Response) => {
    await AuthService.logout(req.user!.id);
    ApiResponse.success(res, null, 'Logged out successfully');
  });
}
