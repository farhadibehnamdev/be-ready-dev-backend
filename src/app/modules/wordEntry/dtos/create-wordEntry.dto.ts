import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateWordEntryDto {
  @IsNotEmpty()
  @IsString()
  word: string;
  meanings: [
    {
      language: string;
      text: string;
    },
  ];

  @IsNotEmpty()
  mastered: boolean;

  @IsNotEmpty()
  @IsString()
  sentense: string;

  @IsNotEmpty()
  @IsString()
  level: string;

  @IsNotEmpty()
  @IsNumber()
  highlightedAt: number;

  @IsNotEmpty()
  @IsString()
  wordType?: string;
  user: Types.ObjectId;
  episode: Types.ObjectId;
}
