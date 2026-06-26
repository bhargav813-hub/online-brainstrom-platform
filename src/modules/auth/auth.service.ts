import jwt from 'jsonwebtoken';
import { User, IUser } from '../users/user.model';
import { env } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import { TokenPayload, UserRole } from '../../types';
import { sendEmail } from '../../utils/email';
import { logger } from '../../config/logger';

/**
 * Authentication Service
 * Handles user registration, login, token generation, and refresh.
 * Business logic is isolated here — no req/res knowledge.
 */
export class AuthService {
  /**
   * Register a new user.
   * Generates and emails a 6-digit verification OTP.
   */
  static async register(data: { name: string; email: string; password: string }) {
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      if (existingUser.isVerified) {
        throw ApiError.conflict('Email already registered');
      }

      // If existing user is unverified, overwrite their registration details
      existingUser.name = data.name;
      existingUser.password = data.password; // pre-save hook will hash this
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      existingUser.otp = otp;
      existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await existingUser.save();

      sendEmail({
        to: existingUser.email,
        subject: 'Email Verification OTP',
        text: `Your email verification OTP is: ${otp}. It will expire in 10 minutes.`,
      }).catch((err) => logger.error('Background email failed:', err));

      return {
        email: existingUser.email,
        message: 'Verification OTP sent to your email',
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      isVerified: false,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    sendEmail({
      to: user.email,
      subject: 'Email Verification OTP',
      text: `Welcome to Brainstorm Platform! Your email verification OTP is: ${otp}. It will expire in 10 minutes.`,
    }).catch((err) => logger.error('Background email failed:', err));

    return {
      email: user.email,
      message: 'Verification OTP sent to your email',
    };
  }

  /**
   * Login with email and password.
   * Verifies that the user has verified their email address first.
   */
  static async login(data: { email: string; password: string }) {
    // Find user with password field (normally excluded)
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('Account has been deactivated');
    }

    if (!user.isVerified) {
      throw ApiError.unauthorized('Please verify your email address first');
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens({
      id: (user._id as any).toString(),
      email: user.email,
      role: UserRole.PARTICIPANT,
    });

    // Save refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  /**
   * Verify registration OTP.
   * Activates user and issues access/refresh tokens.
   */
  static async verifyOtp(data: { email: string; otp: string }) {
    const user = await User.findOne({ email: data.email }).select('+otp +otpExpires');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (user.isVerified) {
      throw ApiError.badRequest('User is already verified');
    }

    if (!user.otp || !user.otpExpires || user.otp !== data.otp || user.otpExpires.getTime() < Date.now()) {
      throw ApiError.badRequest('Invalid or expired OTP');
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate tokens
    const tokens = this.generateTokens({
      id: (user._id as any).toString(),
      email: user.email,
      role: UserRole.PARTICIPANT,
    });

    // Save refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      ...tokens,
    };
  }

  /**
   * Send a password reset OTP.
   */
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound('User with this email not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      text: `You requested a password reset. Your OTP is: ${otp}. It will expire in 10 minutes.`,
    }).catch((err) => logger.error('Background email failed:', err));

    return { message: 'Password reset OTP sent to your email' };
  }

  /**
   * Reset password using reset OTP.
   */
  static async resetPassword(data: { email: string; otp: string; password: string }) {
    const user = await User.findOne({ email: data.email }).select('+otp +otpExpires');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (!user.otp || !user.otpExpires || user.otp !== data.otp || user.otpExpires.getTime() < Date.now()) {
      throw ApiError.badRequest('Invalid or expired reset OTP');
    }

    // Update password (pre-save hashes it) and clear OTP
    user.password = data.password;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  /**
   * Refresh access token using a valid refresh token.
   */
  static async refreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as TokenPayload;

      // Verify the refresh token matches what's stored
      const user = await User.findById(decoded.id).select('+refreshToken');

      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = this.generateTokens({
        id: (user._id as any).toString(),
        email: user.email,
        role: decoded.role,
      });

      // Update stored refresh token
      await User.findByIdAndUpdate(user._id, { refreshToken: tokens.refreshToken });

      return tokens;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw ApiError.unauthorized('Invalid or expired refresh token');
      }
      throw error;
    }
  }

  /**
   * Logout — invalidate refresh token.
   */
  static async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  /**
   * Generate access + refresh token pair.
   */
  private static generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(
      { ...payload },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY } as any
    );

    const refreshToken = jwt.sign(
      { ...payload },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY } as any
    );

    return { accessToken, refreshToken };
  }
}
