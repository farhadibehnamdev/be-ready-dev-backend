import {
  IsString,
  IsOptional,
  IsDate,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreatePersonDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsMongoId()
  image?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];
}
