import { Document, Types } from 'mongoose';

export interface IPersonDocument extends Document {
  name: string;
  biography?: string;
  birthDate?: Date;
  profileImage?: Types.ObjectId;
  roles?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
