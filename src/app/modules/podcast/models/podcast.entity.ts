import { Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PodcastLevel } from '@shared/enums/podcastLevel.enum';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Podcast {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Image', autopopulate: true })
  image: Types.ObjectId;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', autopopulate: true })
  category: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Host', autopopulate: true })
  host: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Episode', autopopulate: true })
  episodes: Types.ObjectId[];

  @Prop({
    type: String,
    enum: Object.values(PodcastLevel),
  })
  level: PodcastLevel;
}

export const PodcastSchema = SchemaFactory.createForClass(Podcast);
