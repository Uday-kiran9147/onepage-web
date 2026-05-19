import { Types } from 'mongoose';
import { FeedbackModel } from '../models/Feedback';
import { UserModel } from '../models/User';
import { moderationQueue, clusteringQueue } from '../lib/queues';
import { AppError } from '../types/AppError';
import type { FeedbackSubmit } from '@mirror/shared';

// Thresholds at which clustering is triggered
const CLUSTERING_THRESHOLDS = [5, 10, 20];

export class FeedbackService {
  /**
   * Submit anonymous feedback to a profile.
   * Enqueues moderation job (never calls Gemini inline).
   */
  static async submit(username: string, data: FeedbackSubmit, ipHash: string) {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) throw new AppError(404, 'Profile not found');

    const feedback = await FeedbackModel.create({
      profileId: user._id,
      answers: data.answers,
      ipHash,
      isModerated: false,
    });

    // Enqueue moderation — Gemini is ONLY called inside BullMQ workers
    await moderationQueue.add('moderate', {
      feedbackId: String(feedback._id),
    });

    // Check if clustering should trigger
    const feedbackCount = await FeedbackModel.countDocuments({ profileId: user._id });
    if (CLUSTERING_THRESHOLDS.includes(feedbackCount)) {
      await clusteringQueue.add(
        'cluster',
        { profileId: String(user._id) },
        {
          jobId: `cluster-${String(user._id)}`,
          delay: 5000,
          removeOnComplete: true,
          removeOnFail: { count: 3 },
        }
      );
    }

    return { id: feedback._id };
  }

  /**
   * Get authenticated user's received feedback.
   */
  static async getMyFeedback(userId: string) {
    const feedback = await FeedbackModel.find({
      profileId: new Types.ObjectId(userId),
      isHidden: false,
      isModerated: true,
    })
      .sort({ createdAt: -1 })
      .select('-__v -ipHash');
    return feedback;
  }

  /**
   * Hide a feedback (receiver action).
   */
  static async hide(feedbackId: string, userId: string) {
    const feedback = await FeedbackModel.findOne({
      _id: feedbackId,
      profileId: new Types.ObjectId(userId),
    });
    if (!feedback) throw new AppError(404, 'Feedback not found');

    feedback.isHidden = true;
    await feedback.save();
    return { success: true };
  }

  /**
   * Report a feedback (receiver action).
   */
  static async report(feedbackId: string, userId: string) {
    const feedback = await FeedbackModel.findOne({
      _id: feedbackId,
      profileId: new Types.ObjectId(userId),
    });
    if (!feedback) throw new AppError(404, 'Feedback not found');

    feedback.isReported = true;
    await feedback.save();
    return { success: true };
  }
}
