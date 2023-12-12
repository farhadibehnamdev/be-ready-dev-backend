import { PaginatedResponseDto } from '@shared/dtos/paginated-response.dto';

import { HostDto } from './host.dto';

export class PaginatedHostDto extends PaginatedResponseDto<HostDto> {
  docs: HostDto[];
}
