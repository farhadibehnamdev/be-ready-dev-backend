import { Document, Types } from 'mongoose';

export interface IFavoriteDocument extends Document {
  podcast: Types.ObjectId;
  user: Types.ObjectId;
}
