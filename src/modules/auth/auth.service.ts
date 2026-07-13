import jwt from 'jsonwebtoken';
import { User, IUser } from '../users/user.model';
import { env } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import { TokenPayload, UserRole } from '../../types';
import { sendEmail } from '../../utils/email';
import { logger } from '../../config/logger';
import redisClient from '../../config/redis';
import bcrypt from 'bcrypt';

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
    const limitKey = `otp-limit:signup:${data.email}`;
    const isLimited = await redisClient.get(limitKey);
    if (isLimited) {
      throw ApiError.tooManyRequests('Please wait 60 seconds before requesting a new OTP');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.setEx(`signup:${data.email}`, 600, JSON.stringify({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      otp,
    }));

    await redisClient.setEx(limitKey, 60, '1');

    sendEmail({
      to: data.email,
      subject: 'Email Verification OTP',
      text: `Welcome to Sovereign Brainstorming Platform! Your email verification OTP is: ${otp}. It will expire in 10 minutes.`,
    }).catch((err) => logger.error('Background email failed:', err));

    return {
      email: data.email,
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
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  /**
   * Verify registration OTP.
   * Activates user and issues access/refresh tokens.
   */
  static async verifyOtp(data: { email: string; otp: string }) {
    const signupKey = `signup:${data.email}`;
    const signupDataStr = await redisClient.get(signupKey);

    if (!signupDataStr) {
      throw ApiError.badRequest('OTP expired. Please sign up again.');
    }

    const signupData = JSON.parse(signupDataStr);

    if (signupData.otp !== data.otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    // Create user in MongoDB
    const user = await User.create({
      name: signupData.name,
      email: signupData.email,
      password: signupData.password, // already hashed
      isVerified: true,
    });

    await redisClient.del(signupKey);

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
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  /**
   * Send a password reset OTP.
   */
  static async forgotPassword(email: string) {
    const limitKey = `otp-limit:reset:${email}`;
    const isLimited = await redisClient.get(limitKey);
    if (isLimited) {
      throw ApiError.tooManyRequests('Please wait 60 seconds before requesting a new OTP');
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound('User with this email not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await redisClient.setEx(`reset:${email}`, 600, JSON.stringify({
      email,
      otp,
    }));

    await redisClient.setEx(limitKey, 60, '1');

    sendEmail({
      to: user.email,
      subject: 'Password Reset OTP',
      text: `You requested a password reset. Your OTP is: ${otp}. It will expire in 10 minutes.`,
    }).catch((err) => logger.error('Background email failed:', err));

    return { message: 'Password reset OTP sent to your email' };
  }

  /**
   * Verify forgot password OTP
   */
  static async verifyResetOtp(data: { email: string; otp: string }) {
    const resetKey = `reset:${data.email}`;
    const resetDataStr = await redisClient.get(resetKey);

    if (!resetDataStr) {
      throw ApiError.badRequest('OTP expired.');
    }

    const resetData = JSON.parse(resetDataStr);

    if (resetData.otp !== data.otp) {
      throw ApiError.badRequest('Invalid OTP');
    }

    await redisClient.del(resetKey);
    await redisClient.setEx(`reset-auth:${data.email}`, 600, 'verified');

    return { message: 'OTP verified successfully. You can now reset your password.' };
  }

  /**
   * Reset password using reset OTP.
   */
  static async resetPassword(data: { email: string; password: string }) {
    const authKey = `reset-auth:${data.email}`;
    const isAuth = await redisClient.get(authKey);

    if (!isAuth) {
      throw ApiError.unauthorized('OTP verification required.');
    }

    const user = await User.findOne({ email: data.email });
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    user.password = await bcrypt.hash(data.password, 12);
    await user.save();
    await redisClient.del(authKey);

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

