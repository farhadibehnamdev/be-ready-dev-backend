import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsNotEmpty()
  targetDays: string[];

  @IsNumber()
  targetValue: number;

  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @IsBoolean()
  active: boolean;

  @IsBoolean()
  achieved: boolean;

  @IsNumber()
  streak: number;

  @IsArray()
  @IsOptional()
  completedDays?: string[];
}
