import { Document, Types } from 'mongoose';

export interface IHostDocument extends Document {
  firstName: string;
  lastName: string;
  displayName: string;
  description: string;
  avatar: Types.ObjectId;
}
