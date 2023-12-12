import mongoose, { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Goal {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: [String], required: true })
  targetDays: string[];

  @Prop({ required: true })
  targetValue: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  achieved: boolean;

  @Prop({ required: true })
  streak: number;

  @Prop({ type: [String] })
  completedDays?: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}
export const GoalSchema = SchemaFactory.createForClass(Goal);
