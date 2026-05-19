import { z } from 'zod';

// ─── Category Enum ───────────────────────────────────────────────
export const CategoryEnum = z.enum(['habit', 'attitude', 'personality']);
export type Category = z.infer<typeof CategoryEnum>;

// ─── User Schema ─────────────────────────────────────────────────
export const UserSchema = z.object({
  _id: z.string(),
  googleId: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  username: z.string().min(1).regex(/^[a-z0-9_-]+$/, 'Username must be lowercase alphanumeric'),
  bio: z.string().default(''),
  isPro: z.boolean().default(false),
  isOnboarded: z.boolean().default(false),
  createdAt: z.coerce.date(),
});
export type User = z.infer<typeof UserSchema>;

export const ProfileUpdateSchema = z.object({
  username: z.string().min(3).regex(/^[a-z0-9_-]+$/, 'Username must be lowercase alphanumeric and at least 3 characters').optional(),
  name: z.string().min(1).optional(),
  bio: z.string().max(160).optional(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;


// ─── Feedback Answer Schema ──────────────────────────────────────
export const FeedbackAnswerSchema = z.object({
  category: CategoryEnum,
  prompt: z.string().min(1),
  text: z.string().min(50, 'Each answer must be at least 50 characters'),
});
export type FeedbackAnswer = z.infer<typeof FeedbackAnswerSchema>;

// ─── Feedback Submit Schema ──────────────────────────────────────
// Exactly 3 answers required — one per category
export const FeedbackSubmitSchema = z.object({
  answers: z.array(FeedbackAnswerSchema).length(3),
});
export type FeedbackSubmit = z.infer<typeof FeedbackSubmitSchema>;

// ─── Pattern Schema ──────────────────────────────────────────────
export const PatternSchema = z.object({
  _id: z.string(),
  profileId: z.string(),
  category: CategoryEnum,
  summary: z.string(),
  count: z.number().int().min(0),
  feedbackIds: z.array(z.string()),
  generatedAt: z.coerce.date(),
});
export type Pattern = z.infer<typeof PatternSchema>;

// ─── Feedback Full Schema (for API responses) ────────────────────
export const FeedbackSchema = z.object({
  _id: z.string(),
  profileId: z.string(),
  answers: z.array(FeedbackAnswerSchema),
  ipHash: z.string(),
  isHidden: z.boolean().default(false),
  isReported: z.boolean().default(false),
  isModerated: z.boolean().default(false),
  createdAt: z.coerce.date(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;
