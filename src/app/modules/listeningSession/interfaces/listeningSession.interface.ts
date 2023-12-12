import { Document, Types } from 'mongoose';

export interface IListeningSessionDocument extends Document {
  user: Types.ObjectId;
  podcast: Types.ObjectId;
  episode: Types.ObjectId;
  durationListened: number;
  timeListend: number;
  currentTime: number;
  startedAt: Date;
  endedAt: Date;
  status: string;
}
