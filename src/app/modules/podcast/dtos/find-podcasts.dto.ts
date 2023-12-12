import { IsOptional, IsString } from 'class-validator';

import { PaginateQueryOptionsDto } from '@shared/dtos/paginate-query-options.dto';

export class FindPodcastsDto extends PaginateQueryOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;
}
