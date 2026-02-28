import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export type EntryStatus = 'pending' | 'approved' | 'rejected';

export interface IEntry extends Document {
  title: string;
  description: string;
  amount: number;
  status: EntryStatus;
  createdBy: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const entrySchema = new Schema<IEntry>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

entrySchema.index({ createdBy: 1 });
entrySchema.index({ status: 1 });

export const Entry = mongoose.model<IEntry>('Entry', entrySchema);
