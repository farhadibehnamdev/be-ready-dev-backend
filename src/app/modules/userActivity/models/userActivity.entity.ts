import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema()
export class UserActivity extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Content' })
  contentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode' })
  episodeId: Types.ObjectId;

  @Prop({
    enum: ['view', 'download', 'rate', 'addToWatchlist'],
    required: true,
  })
  activityType: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
