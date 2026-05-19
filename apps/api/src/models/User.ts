import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  isPro: boolean;
  isOnboarded: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, lowercase: true },
    bio: { type: String, default: '' },
    isPro: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Indexes: username (unique), googleId (unique)
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ googleId: 1 }, { unique: true });

export const UserModel = mongoose.model<IUser>('User', userSchema);
