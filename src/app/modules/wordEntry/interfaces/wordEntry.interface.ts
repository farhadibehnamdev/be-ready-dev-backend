import { Document, Types } from 'mongoose';

export interface IWordEntryDocument extends Document {
  word: string;

  meanings: [
    {
      language: string;
      text: string;
    },
  ];

  mastered: boolean;

  sentense: string;

  level: string;

  highlightedAt: number;

  wordType?: string;

  user: Types.ObjectId;

  episode: Types.ObjectId;
}
