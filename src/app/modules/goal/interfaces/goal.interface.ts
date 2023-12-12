import { Document, Types } from 'mongoose';

export interface IGoalDocument extends Document {
  targetDays: string[];

  targetValue: number;

  startDate: Date;

  active: boolean;

  achieved: boolean;

  streak: number;

  completedDays?: string[];

  user: Types.ObjectId;
}
