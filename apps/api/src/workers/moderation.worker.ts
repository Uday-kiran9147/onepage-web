import { Worker, Job } from 'bullmq';
import { redis } from '../lib/redis';
import { getModel } from '../lib/gemini';
import { FeedbackModel } from '../models/Feedback';

interface ModerationJobData {
  feedbackId: string;
}

const moderationWorker = new Worker<ModerationJobData>(
  'moderation',
  async (job: Job<ModerationJobData>) => {
    const { feedbackId } = job.data;
    console.log(`[Moderation] Processing feedback ${feedbackId}`);

    const feedback = await FeedbackModel.findById(feedbackId);
    if (!feedback) {
      console.error(`[Moderation] Feedback ${feedbackId} not found`);
      return;
    }

    // Concatenate all answer texts for moderation
    const feedbackText = feedback.answers
      .map((a) => `[${a.category}] ${a.text}`)
      .join('\n');

    try {
      const model = getModel();

      const prompt = `You are a content moderator. Respond ONLY with valid JSON — no markdown, no explanation.
Return {"pass": true} if the feedback is acceptable, or {"pass": false, "reason": "short reason"} if it contains hate speech, slurs, threats, sexual content, or targeted harassment.

Feedback: """${feedbackText}"""`;

      const result = await model.generateContent(prompt);
      const raw = result.response.text();
      // Always strip markdown fences before JSON.parse()
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean) as { pass: boolean; reason?: string };

      if (parsed.pass) {
        feedback.isModerated = true;
        await feedback.save();
        console.log(`[Moderation] Feedback ${feedbackId} PASSED`);
      } else {
        feedback.isReported = true;
        feedback.isHidden = true;
        await feedback.save();
        console.log(`[Moderation] Feedback ${feedbackId} FAILED: ${parsed.reason}`);
      }
    } catch (err) {
      console.error(`[Moderation] Error processing feedback ${feedbackId}:`, err);
      throw err; // Let BullMQ handle retry
    }
  },
  { connection: redis, concurrency: 5 }
);

moderationWorker.on('completed', (job) => {
  console.log(`[Moderation] Job ${job.id} completed`);
});

moderationWorker.on('failed', (job, err) => {
  console.error(`[Moderation] Job ${job?.id} failed:`, err.message);
});

export { moderationWorker };
