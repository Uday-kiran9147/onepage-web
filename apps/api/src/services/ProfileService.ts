import { UserModel } from '../models/User';
import { AppError } from '../types/AppError';

export class ProfileService {
  /**
   * Get public profile by username.
   */
  static async getByUsername(username: string) {
    const user = await UserModel.findOne({ username: username.toLowerCase() })
      .select('name username bio isPro createdAt');
    if (!user) throw new AppError(404, 'Profile not found');
    return user;
  }

  /**
   * Check if username is available.
   */
  static async checkUsername(username: string, excludeUserId?: string) {
    const query: any = { username: username.toLowerCase() };
    if (excludeUserId) {
      query._id = { $ne: excludeUserId };
    }
    const user = await UserModel.findOne(query);
    return !user; // true if available, false if taken
  }

  /**
   * Update authenticated user's profile.
   */
  static async updateProfile(userId: string, data: { username?: string; bio?: string; name?: string }) {
    // If updating username, check if available
    if (data.username) {
      const isAvailable = await this.checkUsername(data.username, userId);
      if (!isAvailable) {
        throw new AppError(400, 'Username is already taken');
      }
      data.username = data.username.toLowerCase();
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { ...data, isOnboarded: true } },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
}
