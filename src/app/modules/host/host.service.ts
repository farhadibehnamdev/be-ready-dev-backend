import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { HostRepository } from './repositories/host.repository';

@Injectable()
export class HostService extends BaseService<HostRepository> {
  constructor(protected readonly repository: HostRepository) {
    super();
  }
}
