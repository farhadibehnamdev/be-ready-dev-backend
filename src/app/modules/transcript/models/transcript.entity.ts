import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Word {
  @Prop({ required: true })
  wid: number;

  @Prop({ required: true })
  text: string;
}

const WordSchema = SchemaFactory.createForClass(Word);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Transcript {
  @Prop({
    type: Array<typeof WordSchema>,
    default: [],
  })
  sentence: Array<typeof WordSchema>;

  @Prop({ type: [String], default: [] })
  translation: string[];

  @Prop({ required: true })
  start_time_ms: number;

  @Prop({ required: true })
  end_time_ms: number;
}

export const TranscriptSchema = SchemaFactory.createForClass(Transcript);
