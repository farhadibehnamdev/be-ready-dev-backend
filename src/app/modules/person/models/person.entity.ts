import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Person extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  biography: string;

  @Prop()
  birthDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Image', autopopulate: true })
  image: Types.ObjectId;

  @Prop([String])
  roles: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
