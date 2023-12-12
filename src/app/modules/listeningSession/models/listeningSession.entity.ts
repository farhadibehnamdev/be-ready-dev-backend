import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class ListeningSession {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Podcast' })
  podcast: Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Episode' })
  episode: Types.ObjectId;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Number })
  durationListened: number;

  @Prop({ type: Number })
  timeListend: number;

  @Prop({ type: Number })
  currentTime: number;

  @Prop({ type: Date })
  startedAt: Date;

  @Prop({ type: Date })
  endedAt: Date;
}

export const ListeningSessionSchema =
  SchemaFactory.createForClass(ListeningSession);
