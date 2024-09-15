import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { DeckDto } from './deck.dto';

export class PaginatedDeckDto extends PaginatedResponseDto<DeckDto> {
  docs: DeckDto[];
}
