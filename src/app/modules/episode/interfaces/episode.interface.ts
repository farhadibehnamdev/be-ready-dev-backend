import { Date, Document, Types } from 'mongoose';

export interface IEpisodeDocument extends Document {
  title: string;
  description: string;
  transcript: string;
  duration: string;
  audio: Types.ObjectId;
  likes: number;
  publishDate: Date;
}

export interface IEpisodeAudio {
  message: string;
  audioUrl: string;
  success: boolean;
}
