import { auth, db, Transaction } from '../lib/firebase';
import jwt from 'jsonwebtoken';
import { env } from '../lib/env';
import { AppError } from '../types/AppError';

export class AuthService {
  /**
   * Verify Google OAuth token (issued by Firebase Auth client), create/update user, return JWT.
   */
  static async googleLogin(idToken: string) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      const { uid, email, name, picture } = decodedToken;

      if (!email) {
        throw new AppError(400, 'Email is required from Google Auth');
      }

      // 1. Fetch user from Firestore
      const userRef = db.collection('users').doc(uid);
      const userDoc = await userRef.get();

      let userData: any;

      if (!userDoc.exists) {
        // 2. Generate a unique username from email prefix
        const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
        let username = baseUsername;
        if (username.length < 3) {
          username = username + '123';
        }
        
        let counter = 1;
        // Verify unique username
        while (true) {
          const usernameDoc = await db.collection('usernames').doc(username).get();
          if (!usernameDoc.exists) {
            break;
          }
          username = `${baseUsername}${counter}`;
          counter++;
        }

        userData = {
          id: uid,
          email,
          name: name || email.split('@')[0],
          username,
          bio: '',
          avatarUrl: picture || '',
          isOnboarded: false,
          createdAt: new Date().toISOString(), // Keep it string/ISO for easy serialization
        };

        // Write to both users and usernames in a transaction to ensure uniqueness
        await db.runTransaction(async (transaction: Transaction) => {
          transaction.set(userRef, userData);
          transaction.set(db.collection('usernames').doc(username), { uid });
        });
      } else {
        userData = userDoc.data();
      }

      // Sign local JWT session token — payload: { userId: uid, username: userData.username }
      const token = jwt.sign(
        { userId: uid, username: userData.username },
        env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return { user: userData, token };
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error instanceof AppError) throw error;
      throw new AppError(401, error.message || 'Invalid Google ID token');
    }
  }

  /**
   * Get user by ID.
   */
  static async getMe(userId: string) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) throw new AppError(404, 'User not found');
    return userDoc.data();
  }
}
