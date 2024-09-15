import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { CardDto } from './card.dto';

export class PaginatedCardDto extends PaginatedResponseDto<CardDto> {
  docs: CardDto[];
}
