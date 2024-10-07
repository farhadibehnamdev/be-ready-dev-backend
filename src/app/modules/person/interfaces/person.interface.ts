import { Document, Types } from 'mongoose';

export interface IPersonDocument extends Document {
  name: string;
  biography?: string;
  birthDate?: Date;
  image?: Types.ObjectId;
  roles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
