import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';
import { PersonDto } from './person.dto';

export class PaginatedPersonDto extends PaginatedResponseDto<PersonDto> {
  docs: PersonDto[];
}
