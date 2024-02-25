import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { CreateWordEntryDto } from './create-wordEntry.dto';

export class PaginatedWordEntryDto extends PaginatedResponseDto<CreateWordEntryDto> {
  docs: CreateWordEntryDto[];
}
