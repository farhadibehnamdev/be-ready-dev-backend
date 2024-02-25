import { Date, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  Transcript,
  TranscriptSchema,
} from '@modules/transcript/models/transcript.entity';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Episode {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Audio', autopopulate: true })
  audio: Types.ObjectId;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  likes: number;

  @Prop({ type: [Types.ObjectId], ref: 'Transcript', autopopulate: true })
  transcript: Transcript;

  @Prop({ type: Number, required: true })
  duration: number;

  @Prop({ type: Date, required: true })
  publishDate: Date;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', autopopulate: true })
  tags: Types.ObjectId[];
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
