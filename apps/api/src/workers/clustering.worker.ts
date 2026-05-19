import { Worker, Job } from 'bullmq';
import { Types } from 'mongoose';
import { redis } from '../lib/redis';
import { getModel } from '../lib/gemini';
import { FeedbackModel } from '../models/Feedback';
import { PatternModel } from '../models/Pattern';
import type { Category } from '@mirror/shared';

interface ClusteringJobData {
  profileId: string;
}

const CATEGORIES: Category[] = ['habit', 'attitude', 'personality'];

const clusteringWorker = new Worker<ClusteringJobData>(
  'clustering',
  async (job: Job<ClusteringJobData>) => {
    const { profileId } = job.data;
    console.log(`[Clustering] Processing profile ${profileId}`);

    try {
      const model = getModel();

      for (const category of CATEGORIES) {
        // Fetch all moderated feedback for this profile + category
        const feedbacks = await FeedbackModel.find({
          profileId: new Types.ObjectId(profileId),
          isModerated: true,
          isHidden: false,
        }).select('_id answers');

        // Filter answers by category
        const categoryFeedbacks = feedbacks
          .map((f) => ({
            _id: String(f._id),
            text: f.answers.find((a) => a.category === category)?.text || '',
          }))
          .filter((f) => f.text.length > 0);

        if (categoryFeedbacks.length < 3) {
          console.log(`[Clustering] Skipping ${category} — not enough feedback (${categoryFeedbacks.length})`);
          continue;
        }

        const prompt = `You are an expert at finding patterns in personal feedback.

Here are ${categoryFeedbacks.length} anonymous feedback responses about one person in the category "${category}".
Find 1-3 recurring themes. Return ONLY valid JSON, no markdown:

{"patterns": [{"summary": "string (1 sentence)", "count": number, "ids": ["feedbackId1", ...]}]}

Feedbacks:
${categoryFeedbacks.map((f) => `[${f._id}] ${f.text}`).join('\n')}`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        // Always strip markdown fences before JSON.parse()
        const clean = raw.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(clean) as {
          patterns: Array<{
            summary: string;
            count: number;
            ids: string[];
          }>;
        };

        // Upsert patterns — delete old ones for this category, insert new
        await PatternModel.deleteMany({
          profileId: new Types.ObjectId(profileId),
          category,
        });

        for (const pattern of parsed.patterns) {
          await PatternModel.create({
            profileId: new Types.ObjectId(profileId),
            category,
            summary: pattern.summary,
            count: pattern.count,
            feedbackIds: pattern.ids.map((id) => new Types.ObjectId(id)),
            generatedAt: new Date(),
          });
        }

        console.log(`[Clustering] Created ${parsed.patterns.length} patterns for ${category}`);
      }
    } catch (err) {
      console.error(`[Clustering] Error processing profile ${profileId}:`, err);
      throw err; // Let BullMQ handle retry
    }
  },
  { connection: redis, concurrency: 2 }
);

clusteringWorker.on('completed', (job) => {
  console.log(`[Clustering] Job ${job.id} completed`);
});

clusteringWorker.on('failed', (job, err) => {
  console.error(`[Clustering] Job ${job?.id} failed:`, err.message);
});

export { clusteringWorker };
