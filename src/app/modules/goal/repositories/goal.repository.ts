import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@shared/repositories/base.repository';
import { IGoalDocument } from '../interfaces/goal.interface';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Goal } from '../models/goal.entity';

@Injectable()
export class GoalRepository extends BaseRepository<IGoalDocument> {
  constructor(
    @InjectModel(Goal.name)
    protected readonly model: PaginateModel<IGoalDocument>,
  ) {
    super(model);
  }
}
