import mongoose, { Schema, Document, Types } from 'mongoose';

interface IFeedbackAnswer {
  category: 'habit' | 'attitude' | 'personality';
  prompt: string;
  text: string;
}

export interface IFeedback extends Document {
  profileId: Types.ObjectId;
  answers: IFeedbackAnswer[];
  ipHash: string;
  isHidden: boolean;
  isReported: boolean;
  isModerated: boolean;
  createdAt: Date;
}

const feedbackAnswerSchema = new Schema<IFeedbackAnswer>(
  {
    category: {
      type: String,
      required: true,
      enum: ['habit', 'attitude', 'personality'],
    },
    prompt: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const feedbackSchema = new Schema<IFeedback>(
  {
    profileId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    answers: { type: [feedbackAnswerSchema], required: true },
    ipHash: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    isReported: { type: Boolean, default: false },
    isModerated: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes: profileId + createdAt (compound), ipHash
feedbackSchema.index({ profileId: 1, createdAt: -1 });
feedbackSchema.index({ ipHash: 1 });

export const FeedbackModel = mongoose.model<IFeedback>('Feedback', feedbackSchema);
