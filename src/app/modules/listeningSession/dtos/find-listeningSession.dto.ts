import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';
import { IsOptional, IsString } from 'class-validator';

export class FindListeningSessionsDto extends PaginateQueryOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
