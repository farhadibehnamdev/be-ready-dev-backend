import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
})
export class WordEntry {
  @Prop({ required: true })
  word: string;

  @Prop()
  meanings: [
    {
      language: string;
      text: string;
    },
  ];

  @Prop({ required: true, default: false })
  mastered: boolean;

  @Prop({ required: true, default: false })
  sentense: string;

  @Prop({ required: true })
  level: string;

  @Prop({ required: true, default: Date.now })
  highlightedAt: number;

  @Prop({
    enum: ['Idiom', 'PhrasalVerb', 'Slang', 'Word'],
  })
  wordType?: string;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  episode: Types.ObjectId;
}

export const WordEntrySchema = SchemaFactory.createForClass(WordEntry);
