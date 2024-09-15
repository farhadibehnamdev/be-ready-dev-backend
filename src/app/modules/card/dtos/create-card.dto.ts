import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardDto {
  @IsNotEmpty()
  deckId: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
