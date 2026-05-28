import jwt from 'jsonwebtoken';
import { User, IUser } from '../users/user.model';
import { env } from '../../config/env';
import { ApiError } from '../../utils/apiError';
import { TokenPayload, UserRole } from '../../types';

/**
 * Authentication Service
 * Handles user registration, login, token generation, and refresh.
 * Business logic is isolated here — no req/res knowledge.
 */
export class AuthService {
  /**
   * Register a new user.
   * Returns user data and tokens.
   */
  static async register(data: { name: string; email: string; password: string }) {
    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create user (password is hashed in the pre-save hook)
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Generate tokens
    const tokens = this.generateTokens({
      id: (user._id as any).toString(),
      email: user.email,
      role: UserRole.PARTICIPANT, // Default role
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
   * Login with email and password.
   * Returns user data and tokens.
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
