import { Types } from 'mongoose';
import { PatternModel } from '../models/Pattern';

export class PatternService {
  /**
   * Get AI-clustered patterns for the authenticated user.
   */
  static async getPatterns(userId: string) {
    const patterns = await PatternModel.find({
      profileId: new Types.ObjectId(userId),
    })
      .sort({ generatedAt: -1 })
      .select('-__v');
    return patterns;
  }
}
