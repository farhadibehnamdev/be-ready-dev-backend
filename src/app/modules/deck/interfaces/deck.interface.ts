import { Document, Types } from 'mongoose';

export interface IDeckDocument extends Document {
  name: string;
  description?: string;
  category: string;
  createdBy: Types.ObjectId;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
