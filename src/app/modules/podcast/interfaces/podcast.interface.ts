import { PodcastLevel } from '@shared/enums/podcastLevel.enum';
import { Document, Types } from 'mongoose';

export interface IPodcastDocument extends Document {
  title: string;
  image: Types.ObjectId | string;
  description: string;
  category: Types.ObjectId | string;
  host: Types.ObjectId | string;
  episodes: Types.ObjectId[] | string[];
  level: PodcastLevel;
}

export interface IPodcastImage {
  message: string;
  imageUrl: string;
  success: boolean;
}
