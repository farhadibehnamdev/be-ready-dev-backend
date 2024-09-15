import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDeckDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
