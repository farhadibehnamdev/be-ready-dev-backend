import { Document } from 'mongoose';

export interface IAudioDocument extends Document {
  path: string;
  pathWithFilename: string;
  filename: string;
  mime: string;
}
