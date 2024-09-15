import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  profilePicture: string;

  @Prop({ enum: ['user', 'admin', 'moderator'], default: 'user' })
  role: string;

  @Prop({ enum: ['free', 'premium', 'vip'], default: 'free' })
  subscriptionStatus: string;

  @Prop()
  subscriptionExpiryDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Content' }] })
  watchHistory: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Content' }] })
  watchlist: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
