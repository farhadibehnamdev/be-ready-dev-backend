import { Document } from 'mongoose';
import { IWord } from './word.interface';

export interface ITranscriptDocument extends Document {
  sentence: IWord[];
  translation: string[];
  start_time_ms: number;
  end_time_ms: number;
}
