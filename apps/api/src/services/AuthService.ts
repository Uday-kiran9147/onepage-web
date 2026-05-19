import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import { env } from '../lib/env';
import { AppError } from '../types/AppError';

const googleClient = new OAuth2Client();

export class AuthService {
  /**
   * Verify Google OAuth token, create/update user, return JWT.
   */
  static async googleLogin(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      // audience can be set if needed
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      throw new AppError(401, 'Invalid Google token');
    }

    const { sub: googleId, email, name, picture } = payload;

    // Upsert user
    let user = await UserModel.findOne({ googleId });
    if (!user) {
      // Generate username from email prefix
      const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
      let username = baseUsername;
      let counter = 1;
      while (await UserModel.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await UserModel.create({
        googleId,
        email,
        name: name || email.split('@')[0],
        username,
      });
    }

    // Sign JWT — payload: { userId, username }, 7 days
    const token = jwt.sign(
      { userId: String(user._id), username: user.username },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { user, token };
  }

  /**
   * Get user by ID.
   */
  static async getMe(userId: string) {
    const user = await UserModel.findById(userId).select('-__v');
    if (!user) throw new AppError(404, 'User not found');
    return user;
  }
}
