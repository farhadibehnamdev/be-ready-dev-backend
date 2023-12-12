import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
  },
})
export class Audio {
  @Prop({ type: String })
  path: string;

  @Prop({ type: String })
  pathWithFilename: string;

  @Prop({ type: String })
  filename: string;

  @Prop({ type: String })
  mime: string;
}

const AudioSchema = SchemaFactory.createForClass(Audio);

type AudioDocument = Audio & Document;

AudioSchema.virtual('url').get(function (this: AudioDocument) {
  return process.env.AWS_S3_BASE_URL + '/' + this.pathWithFilename;
});

export { AudioSchema };
