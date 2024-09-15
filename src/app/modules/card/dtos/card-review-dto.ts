import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardReviewDto {
  @IsNotEmpty()
  @IsString()
  cardId: string;
  @IsNotEmpty()
  @IsNumber()
  grade: number;
}
