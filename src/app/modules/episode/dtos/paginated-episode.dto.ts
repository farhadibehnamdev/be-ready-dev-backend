import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { EpisodeDto } from './episode.dto';

export class PaginatedEpisodeDto extends PaginatedResponseDto<EpisodeDto> {
  docs: EpisodeDto[];
}
