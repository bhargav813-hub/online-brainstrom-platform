import { User } from './user.model';
import { ApiError } from '../../utils/apiError';

/**
 * User Service — profile management.
 */
export class UserService {
  /** Get user profile by ID. */
  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  /** Update user profile. */
  static async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  /** Search users by exact email (to prevent global user enumeration/scraping). */
  static async search(query: string, limit = 10) {
    if (!query) return [];
    
    return User.find({
      email: query.toLowerCase(),
      isActive: true,
    })
      .select('name email avatar')
      .limit(limit);
  }

  /** Change user password. */
  static async changePassword(userId: string, data: any) {
    const user = await User.findById(userId).select('+password');
    if (!user) throw ApiError.notFound('User not found');

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) throw ApiError.unauthorized('Incorrect current password');

    user.password = data.newPassword;
    await user.save();
  }
}
