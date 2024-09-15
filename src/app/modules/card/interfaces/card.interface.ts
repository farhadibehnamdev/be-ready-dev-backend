import { Document, Types } from 'mongoose';
import { SuperMemoItem } from 'supermemo';

export interface ICardDocument extends Document, SuperMemoItem {
  deckId: Types.ObjectId;
  question: string;
  answer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate: string;
  image?: Types.ObjectId;
}
