import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';
import { Type } from 'class-transformer';

export class FindPersonsDto extends PaginateQueryOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @IsOptional()
  @IsDateString()
  birthDateFrom?: string;

  @IsOptional()
  @IsDateString()
  birthDateTo?: string;

  @IsOptional()
  @Type(() => Boolean)
  hasProfileImage?: boolean;
}
