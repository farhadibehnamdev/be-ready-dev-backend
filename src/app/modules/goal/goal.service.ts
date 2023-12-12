import { Injectable } from '@nestjs/common';
import { BaseService } from '@shared/services/base.service';

import { GoalRepository } from './repositories/goal.repository';

@Injectable()
export class GoalService extends BaseService<GoalRepository> {
  constructor(protected readonly repository: GoalRepository) {
    super();
  }
}
