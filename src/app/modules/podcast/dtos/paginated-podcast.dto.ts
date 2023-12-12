import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { PodcastDto } from './podcast.dto';

export class PaginatedHostDto extends PaginatedResponseDto<PodcastDto> {
  docs: PodcastDto[];
}
