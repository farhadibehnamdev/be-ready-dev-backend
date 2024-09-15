import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardState } from '@shared/enums/card-state.enum';
import { Types } from 'mongoose';
import { ICardDocument } from '../interfaces/card.interface';
@Schema()
export class Card extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Deck', required: true })
  deckId: Types.ObjectId;

  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop([String])
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  dueDate: string;

  @Prop({ required: false })
  image?: Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
