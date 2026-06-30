import { db, Transaction } from '../lib/firebase';
import { AppError } from '../types/AppError';

const RESERVED_USERNAMES = new Set(['admin', 'support', 'root', 'api', 'team']);

export class ProfileService {
  /**
   * Get public profile by username.
   */
  static async getByUsername(username: string) {
    const cleanedUsername = username.toLowerCase().trim();
    
    // 1. Resolve UID from usernames registry
    const usernameDoc = await db.collection('usernames').doc(cleanedUsername).get();
    if (!usernameDoc.exists) throw new AppError(404, 'Profile not found');
    
    const uid = usernameDoc.data()?.uid;
    if (!uid) throw new AppError(404, 'Profile not found');

    // 2. Fetch User Profile
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) throw new AppError(404, 'Profile not found');

    const data = userDoc.data();
    return {
      id: data?.id,
      name: data?.name,
      username: data?.username,
      bio: data?.bio || '',
      avatarUrl: data?.avatarUrl || '',
      createdAt: data?.createdAt,
    };
  }

  /**
   * Check if username is available.
   */
  static async checkUsername(username: string, excludeUserId?: string) {
    const cleanedUsername = username.toLowerCase().trim();
    
    // Check reserved list
    if (RESERVED_USERNAMES.has(cleanedUsername)) {
      return false;
    }

    const usernameDoc = await db.collection('usernames').doc(cleanedUsername).get();
    if (!usernameDoc.exists) {
      return true; // available
    }

    const uid = usernameDoc.data()?.uid;
    return uid === excludeUserId; // available if owned by the same user
  }

  /**
   * Update authenticated user's profile.
   */
  static async updateProfile(userId: string, data: { username?: string; bio?: string; name?: string; avatarUrl?: string }) {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) throw new AppError(404, 'User not found');

    const currentUserData = userDoc.data() || {};
    const oldUsername = currentUserData.username ? currentUserData.username.toLowerCase() : '';
    const newUsername = data.username ? data.username.toLowerCase().trim() : '';

    const updatePayload: any = { ...data, isOnboarded: true };

    if (newUsername && newUsername !== oldUsername) {
      // Validate unique username
      const isAvailable = await this.checkUsername(newUsername, userId);
      if (!isAvailable) {
        throw new AppError(400, 'Username is already taken or reserved');
      }

      updatePayload.username = newUsername;

      // Use a Firestore transaction to change username registry atomically
      await db.runTransaction(async (transaction: Transaction) => {
        if (oldUsername) {
          // Delete old username registration
          transaction.delete(db.collection('usernames').doc(oldUsername));
        }
        // Register new username
        transaction.set(db.collection('usernames').doc(newUsername), { uid: userId });
        // Update user profile
        transaction.update(userRef, updatePayload);
      });
    } else {
      // Just update the profile fields
      if (newUsername) {
        updatePayload.username = newUsername;
      }
      await userRef.update(updatePayload);
    }

    const updatedUserDoc = await userRef.get();
    return updatedUserDoc.data();
  }
}
