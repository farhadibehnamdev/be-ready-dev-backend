import { IsOptional, IsString } from 'class-validator';

import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindCardsDto extends PaginateQueryOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
